import { NextResponse, type NextRequest } from "next/server";
import { buildGoogleOAuthUrl } from "@/lib/auth/google";
import { getCliFlowConfig } from "@/lib/auth/config";
import { getCliLoginSession, updateCliLoginSession } from "@/lib/auth/db";
import { logAuditEvent } from "@/lib/auth/audit";
import { randomToken, sha256Hex } from "@/lib/auth/crypto";
import { isSessionExpired } from "@/lib/auth/polling";

function toVerifyErrorRedirect(request: NextRequest, sessionId: string, error: string) {
  const url = new URL("/advncd/verify", request.nextUrl.origin);
  url.searchParams.set("session_id", sessionId);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

function isOriginAllowed(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  if (!isOriginAllowed(request)) {
    return toVerifyErrorRedirect(request, sessionId, "origin_not_allowed");
  }

  const session = await getCliLoginSession(sessionId);
  if (!session) {
    return toVerifyErrorRedirect(request, sessionId, "session_not_found");
  }

  if (session.status !== "pending") {
    return toVerifyErrorRedirect(request, sessionId, `session_${session.status}`);
  }

  if (isSessionExpired(session.expires_at)) {
    await updateCliLoginSession(session.session_id, { status: "expired" });
    return toVerifyErrorRedirect(request, sessionId, "session_expired");
  }

  const state = randomToken(24);
  const nonce = randomToken(16);

  await updateCliLoginSession(session.session_id, {
    oauth_state_hash: sha256Hex(state),
    oauth_nonce: nonce,
    oauth_started_at: new Date().toISOString(),
  });

  const flow = getCliFlowConfig();
  const response = NextResponse.redirect(buildGoogleOAuthUrl({ state, nonce }));
  response.cookies.set("advncd_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: flow.cliSessionTtlSeconds,
  });

  await logAuditEvent({
    eventType: "oauth_browser_redirect_started",
    request,
    sessionId: session.session_id,
    userId: session.user_id,
  });

  return response;
}
