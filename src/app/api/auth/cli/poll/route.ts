import { NextResponse, type NextRequest } from "next/server";
import {
  createAppTokenRecord,
  getCliLoginSession,
  getUserById,
  updateCliLoginSession,
} from "@/lib/auth/db";
import { logAuditEvent } from "@/lib/auth/audit";
import { getTokenConfig } from "@/lib/auth/config";
import { hashRefreshToken } from "@/lib/auth/crypto";
import { evaluatePollRateLimit, isSessionExpired } from "@/lib/auth/polling";
import { generateAppRefreshToken, signAppAccessToken } from "@/lib/auth/tokens";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const session = await getCliLoginSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "session not found" }, { status: 404 });
  }

  if (isSessionExpired(session.expires_at)) {
    if (session.status !== "expired") {
      await updateCliLoginSession(session.session_id, { status: "expired" });
    }

    await logAuditEvent({
      eventType: "cli_poll_expired",
      request,
      sessionId: session.session_id,
      userId: session.user_id,
    });

    return NextResponse.json({ status: "expired" }, { status: 410 });
  }

  const rate = evaluatePollRateLimit(session);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "slow_down",
        retry_after_seconds: rate.retryAfterSeconds,
      },
      { status: 429 },
    );
  }

  await updateCliLoginSession(session.session_id, {
    poll_count: session.poll_count + 1,
    last_poll_at: new Date().toISOString(),
  });

  if (session.status === "pending") {
    return NextResponse.json({ status: "pending" });
  }

  if (session.status === "denied") {
    return NextResponse.json({ status: "denied" });
  }

  if (session.status !== "approved" || !session.user_id) {
    return NextResponse.json({ error: "invalid session state" }, { status: 400 });
  }

  const user = await getUserById(session.user_id);
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const appAccessToken = await signAppAccessToken({
    userId: user.id,
    email: user.email,
    sessionId: session.session_id,
  });

  const appRefreshToken = generateAppRefreshToken();
  const refreshTokenHash = hashRefreshToken(appRefreshToken);
  const tokenConfig = getTokenConfig();
  const refreshExpiresAt = new Date(
    Date.now() + tokenConfig.appRefreshTokenTtlSeconds * 1000,
  ).toISOString();

  await createAppTokenRecord({
    userId: user.id,
    sessionId: session.session_id,
    refreshTokenHash,
    refreshExpiresAt,
  });

  await logAuditEvent({
    eventType: "cli_poll_approved",
    request,
    sessionId: session.session_id,
    userId: user.id,
    meta: {
      refresh_expires_at: refreshExpiresAt,
    },
  });

  return NextResponse.json({
    status: "approved",
    app_access_token: appAccessToken,
    app_refresh_token: appRefreshToken,
    expires_in: tokenConfig.appAccessTokenTtlSeconds,
    email: user.email,
  });
}
