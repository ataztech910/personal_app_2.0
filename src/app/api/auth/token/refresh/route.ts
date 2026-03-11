import { NextResponse, type NextRequest } from "next/server";
import { logAuditEvent } from "@/lib/auth/audit";
import { getTokenConfig } from "@/lib/auth/config";
import { getAppTokenByRefreshHash, getUserById, markAppTokenUsed } from "@/lib/auth/db";
import { hashRefreshToken } from "@/lib/auth/crypto";
import { signAppAccessToken } from "@/lib/auth/tokens";

export async function POST(request: NextRequest) {
  let payload: { app_refresh_token?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json payload" }, { status: 400 });
  }

  const refreshToken = payload.app_refresh_token;
  if (!refreshToken) {
    return NextResponse.json({ error: "app_refresh_token is required" }, { status: 400 });
  }

  const refreshHash = hashRefreshToken(refreshToken);
  const tokenRow = await getAppTokenByRefreshHash(refreshHash);
  if (!tokenRow || tokenRow.revoked_at) {
    return NextResponse.json({ error: "invalid refresh token" }, { status: 401 });
  }

  if (Date.now() >= new Date(tokenRow.refresh_expires_at).getTime()) {
    return NextResponse.json({ error: "refresh token expired" }, { status: 401 });
  }

  const user = await getUserById(tokenRow.user_id);
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const appAccessToken = await signAppAccessToken({
    userId: user.id,
    email: user.email,
    sessionId: tokenRow.session_id || undefined,
  });

  await markAppTokenUsed(refreshHash);
  await logAuditEvent({
    eventType: "app_token_refreshed",
    request,
    userId: user.id,
    sessionId: tokenRow.session_id,
  });

  return NextResponse.json({
    app_access_token: appAccessToken,
    expires_in: getTokenConfig().appAccessTokenTtlSeconds,
  });
}
