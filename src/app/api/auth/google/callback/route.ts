import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { logAuditEvent } from "@/lib/auth/audit";
import { encryptSecret, sha256Hex } from "@/lib/auth/crypto";
import {
  findCliLoginSessionByStateHash,
  updateCliLoginSession,
  upsertGoogleOAuthAccount,
  upsertUserByGoogle,
} from "@/lib/auth/db";
import { exchangeCodeForTokens, fetchGoogleUserInfo } from "@/lib/auth/google";
import { isSessionExpired } from "@/lib/auth/polling";

function htmlPage(input: { title: string; message: string; success?: boolean }) {
  const color = input.success ? "#2f9e44" : "#e03131";
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${input.title}</title>
  </head>
  <body style="margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0f172a;color:#e2e8f0;">
    <main style="max-width:680px;margin:10vh auto;padding:24px;border:1px solid #334155;border-radius:12px;background:#111827;">
      <h1 style="margin:0 0 10px 0;font-size:24px;">${input.title}</h1>
      <p style="margin:0 0 8px 0;color:${color};font-weight:600;">${input.message}</p>
      <p style="margin:12px 0 0 0;color:#94a3b8;">You can now return to the CLI.</p>
    </main>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const oauthError = request.nextUrl.searchParams.get("error");
  const oauthErrorDescription =
    request.nextUrl.searchParams.get("error_description") || "Authorization failed";

  if (!state) {
    return htmlPage({
      title: "OAuth Failed",
      message: "Missing state parameter.",
    });
  }

  const stateHash = sha256Hex(state);
  const session = await findCliLoginSessionByStateHash(stateHash);
  if (!session) {
    return htmlPage({
      title: "OAuth Failed",
      message: "Login session was not found.",
    });
  }

  const stateCookie = request.cookies.get("advncd_oauth_state")?.value;
  if (!stateCookie || stateCookie !== state) {
    await logAuditEvent({
      eventType: "oauth_state_mismatch",
      request,
      sessionId: session.session_id,
      userId: session.user_id,
      meta: { reason: "csrf_state_mismatch" },
    });
    return htmlPage({
      title: "OAuth Failed",
      message: "Invalid CSRF state. Please restart login from CLI.",
    });
  }

  if (session.status !== "pending") {
    return htmlPage({
      title: "Session Not Pending",
      message: `This session is already ${session.status}.`,
    });
  }

  if (isSessionExpired(session.expires_at)) {
    await updateCliLoginSession(session.session_id, { status: "expired" });
    return htmlPage({
      title: "Session Expired",
      message: "This login session has expired. Run advncd login again.",
    });
  }

  if (oauthError) {
    await updateCliLoginSession(session.session_id, {
      status: "denied",
      denied_at: new Date().toISOString(),
    });
    await logAuditEvent({
      eventType: "oauth_user_denied",
      request,
      sessionId: session.session_id,
      userId: session.user_id,
      meta: {
        oauth_error: oauthError,
      },
    });

    return htmlPage({
      title: "Authorization Denied",
      message: oauthErrorDescription,
    });
  }

  if (!code) {
    return htmlPage({
      title: "OAuth Failed",
      message: "Missing authorization code.",
    });
  }

  try {
    const tokenResult = await exchangeCodeForTokens(code);
    if (tokenResult.id_token && session.oauth_nonce) {
      const claims = decodeJwt(tokenResult.id_token);
      if (claims.nonce !== session.oauth_nonce) {
        throw new Error("Invalid nonce in id_token");
      }
    }

    const userInfo = await fetchGoogleUserInfo(tokenResult.access_token);
    const user = await upsertUserByGoogle({
      email: userInfo.email,
      googleSub: userInfo.sub,
    });

    await upsertGoogleOAuthAccount({
      userId: user.id,
      providerAccountId: userInfo.sub,
      encryptedRefreshToken: tokenResult.refresh_token
        ? encryptSecret(tokenResult.refresh_token)
        : undefined,
      scopes: tokenResult.scope,
    });

    await updateCliLoginSession(session.session_id, {
      status: "approved",
      approved_at: new Date().toISOString(),
      user_id: user.id,
    });

    await logAuditEvent({
      eventType: "oauth_approved",
      request,
      sessionId: session.session_id,
      userId: user.id,
      meta: {
        email: user.email,
      },
    });

    const response = htmlPage({
      title: "Authorization Successful",
      message: "CLI login has been approved.",
      success: true,
    });
    response.cookies.delete("advncd_oauth_state");
    return response;
  } catch (error) {
    await updateCliLoginSession(session.session_id, {
      status: "denied",
      denied_at: new Date().toISOString(),
    });
    await logAuditEvent({
      eventType: "oauth_callback_failed",
      request,
      sessionId: session.session_id,
      userId: session.user_id,
      meta: {
        reason: error instanceof Error ? error.message : "unknown",
      },
    });

    return htmlPage({
      title: "OAuth Failed",
      message: error instanceof Error ? error.message : "Unexpected OAuth error",
    });
  }
}
