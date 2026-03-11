import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  type AppTokenRow,
  type CliLoginSessionRow,
  type OAuthAccountRow,
  type UserRow,
} from "./types";

function throwIfError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

function requireData<T>(data: T | null, message: string): T {
  if (data === null) {
    throw new Error(message);
  }
  return data;
}

export async function createCliLoginSession(input: {
  sessionId: string;
  deviceName?: string;
  expiresAt: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<CliLoginSessionRow> {
  const { data, error } = await supabaseAdmin
    .from("cli_login_sessions")
    .insert({
      session_id: input.sessionId,
      status: "pending",
      device_name: input.deviceName || null,
      expires_at: input.expiresAt,
      ip: input.ip || null,
      user_agent: input.userAgent || null,
    })
    .select("*")
    .single<CliLoginSessionRow>();

  throwIfError(error);
  return requireData(data, "Failed to create cli_login_sessions row");
}

export async function getCliLoginSession(
  sessionId: string,
): Promise<CliLoginSessionRow | null> {
  const { data, error } = await supabaseAdmin
    .from("cli_login_sessions")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle<CliLoginSessionRow>();

  throwIfError(error);
  return data;
}

export async function findCliLoginSessionByStateHash(
  stateHash: string,
): Promise<CliLoginSessionRow | null> {
  const { data, error } = await supabaseAdmin
    .from("cli_login_sessions")
    .select("*")
    .eq("oauth_state_hash", stateHash)
    .maybeSingle<CliLoginSessionRow>();

  throwIfError(error);
  return data;
}

export async function updateCliLoginSession(
  sessionId: string,
  patch: Partial<CliLoginSessionRow>,
): Promise<CliLoginSessionRow> {
  const { data, error } = await supabaseAdmin
    .from("cli_login_sessions")
    .update(patch)
    .eq("session_id", sessionId)
    .select("*")
    .single<CliLoginSessionRow>();

  throwIfError(error);
  return requireData(data, "Failed to update cli_login_sessions row");
}

export async function upsertUserByGoogle(input: {
  email: string;
  googleSub: string;
}): Promise<UserRow> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        email: input.email.toLowerCase(),
        google_sub: input.googleSub,
      },
      { onConflict: "email" },
    )
    .select("*")
    .single<UserRow>();

  throwIfError(error);
  return requireData(data, "Failed to upsert users row");
}

export async function getUserById(userId: string): Promise<UserRow | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle<UserRow>();

  throwIfError(error);
  return data;
}

export async function upsertGoogleOAuthAccount(input: {
  userId: string;
  providerAccountId: string;
  encryptedRefreshToken?: string;
  scopes?: string;
}): Promise<OAuthAccountRow> {
  const existing = await getGoogleOAuthAccountByUserId(input.userId);
  const encryptedRefreshToken =
    input.encryptedRefreshToken || existing?.encrypted_refresh_token;

  if (!encryptedRefreshToken) {
    throw new Error("Google refresh token is missing");
  }

  const { data, error } = await supabaseAdmin
    .from("oauth_accounts")
    .upsert(
      {
        user_id: input.userId,
        provider: "google",
        provider_account_id: input.providerAccountId,
        encrypted_refresh_token: encryptedRefreshToken,
        scopes: input.scopes || existing?.scopes || null,
      },
      { onConflict: "user_id,provider" },
    )
    .select("*")
    .single<OAuthAccountRow>();

  throwIfError(error);
  return requireData(data, "Failed to upsert oauth_accounts row");
}

export async function getGoogleOAuthAccountByUserId(
  userId: string,
): Promise<OAuthAccountRow | null> {
  const { data, error } = await supabaseAdmin
    .from("oauth_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "google")
    .maybeSingle<OAuthAccountRow>();

  throwIfError(error);
  return data;
}

export async function createAppTokenRecord(input: {
  userId: string;
  sessionId?: string;
  refreshTokenHash: string;
  refreshExpiresAt: string;
}): Promise<AppTokenRow> {
  const { data, error } = await supabaseAdmin
    .from("app_tokens")
    .insert({
      user_id: input.userId,
      session_id: input.sessionId || null,
      refresh_token_hash: input.refreshTokenHash,
      refresh_expires_at: input.refreshExpiresAt,
    })
    .select("*")
    .single<AppTokenRow>();

  throwIfError(error);
  return requireData(data, "Failed to create app_tokens row");
}

export async function getAppTokenByRefreshHash(
  refreshTokenHash: string,
): Promise<AppTokenRow | null> {
  const { data, error } = await supabaseAdmin
    .from("app_tokens")
    .select("*")
    .eq("refresh_token_hash", refreshTokenHash)
    .maybeSingle<AppTokenRow>();

  throwIfError(error);
  return data;
}

export async function markAppTokenUsed(refreshTokenHash: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("app_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("refresh_token_hash", refreshTokenHash);

  throwIfError(error);
}

export async function revokeAppToken(refreshTokenHash: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("app_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("refresh_token_hash", refreshTokenHash)
    .is("revoked_at", null);

  throwIfError(error);
}

export async function revokeAllUserAppTokens(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("app_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("revoked_at", null);

  throwIfError(error);
}
