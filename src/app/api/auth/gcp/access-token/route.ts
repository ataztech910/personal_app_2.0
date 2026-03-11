import { NextResponse, type NextRequest } from "next/server";
import { logAuditEvent } from "@/lib/auth/audit";
import { decryptSecret } from "@/lib/auth/crypto";
import { getGoogleOAuthAccountByUserId } from "@/lib/auth/db";
import { refreshGoogleAccessToken } from "@/lib/auth/google";
import { extractBearerToken, verifyAppAccessToken } from "@/lib/auth/tokens";

export async function POST(request: NextRequest) {
  const bearer = extractBearerToken(request.headers.get("authorization"));
  if (!bearer) {
    return NextResponse.json({ error: "missing bearer token" }, { status: 401 });
  }

  let accessClaims;
  try {
    accessClaims = await verifyAppAccessToken(bearer);
  } catch {
    return NextResponse.json({ error: "invalid app_access_token" }, { status: 401 });
  }

  const googleAccount = await getGoogleOAuthAccountByUserId(accessClaims.sub);
  if (!googleAccount) {
    return NextResponse.json({ error: "google account not linked" }, { status: 404 });
  }

  try {
    const googleRefreshToken = decryptSecret(googleAccount.encrypted_refresh_token);
    const tokenResult = await refreshGoogleAccessToken(googleRefreshToken);

    await logAuditEvent({
      eventType: "gcp_access_token_issued",
      request,
      userId: accessClaims.sub,
      sessionId: accessClaims.sid || null,
      meta: {
        expires_in: tokenResult.expires_in,
      },
    });

    return NextResponse.json({
      access_token: tokenResult.access_token,
      token_type: tokenResult.token_type || "Bearer",
      expires_in: tokenResult.expires_in,
    });
  } catch (error) {
    await logAuditEvent({
      eventType: "gcp_access_token_failed",
      request,
      userId: accessClaims.sub,
      sessionId: accessClaims.sid || null,
      meta: {
        reason: error instanceof Error ? error.message : "unknown",
      },
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "failed to refresh gcp token" },
      { status: 401 },
    );
  }
}
