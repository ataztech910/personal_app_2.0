import { NextResponse, type NextRequest } from "next/server";
import { logAuditEvent } from "@/lib/auth/audit";
import { revokeAllUserAppTokens, revokeAppToken } from "@/lib/auth/db";
import { hashRefreshToken } from "@/lib/auth/crypto";
import { extractBearerToken, verifyAppAccessToken } from "@/lib/auth/tokens";

export async function POST(request: NextRequest) {
  let payload: { app_refresh_token?: string } = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const refreshToken = payload.app_refresh_token;
  if (refreshToken) {
    await revokeAppToken(hashRefreshToken(refreshToken));
  }

  const bearer = extractBearerToken(request.headers.get("authorization"));
  if (bearer) {
    try {
      const claims = await verifyAppAccessToken(bearer);
      await revokeAllUserAppTokens(claims.sub);
      await logAuditEvent({
        eventType: "logout_by_access_token",
        request,
        userId: claims.sub,
        sessionId: claims.sid || null,
      });
    } catch {
      // Invalid bearer token during logout should not fail refresh-token revocation.
    }
  }

  await logAuditEvent({
    eventType: "logout",
    request,
  });

  return NextResponse.json({ success: true });
}
