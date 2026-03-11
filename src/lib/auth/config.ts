import { type NextRequest } from "next/server";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseIntOrDefault(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getAuthConfig() {
  return {
    ...getTokenConfig(),
    ...getCliFlowConfig(),
    ...getGoogleOAuthConfig(),
  };
}

export function getGoogleOAuthConfig() {
  return {
    googleClientId: requireEnv("GOOGLE_CLIENT_ID"),
    googleClientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    googleRedirectUri: requireEnv("GOOGLE_REDIRECT_URI"),
    oauthScope:
      process.env.GOOGLE_OAUTH_SCOPE ||
      "openid email profile https://www.googleapis.com/auth/cloud-platform",
  };
}

export function getTokenConfig() {
  return {
    tokenEncryptionKey: requireEnv("TOKEN_ENCRYPTION_KEY"),
    tokenEncryptionKeyVersion: process.env.TOKEN_ENCRYPTION_KEY_VERSION || "v1",
    appJwtSecret: requireEnv("APP_JWT_SECRET"),
    refreshTokenPepper: requireEnv("REFRESH_TOKEN_PEPPER"),
    appAccessTokenTtlSeconds: parseIntOrDefault(
      process.env.APP_ACCESS_TOKEN_TTL_SECONDS,
      900,
    ),
    appRefreshTokenTtlSeconds: parseIntOrDefault(
      process.env.APP_REFRESH_TOKEN_TTL_SECONDS,
      60 * 60 * 24 * 30,
    ),
  };
}

export function getCliFlowConfig() {
  return {
    cliSessionTtlSeconds: parseIntOrDefault(process.env.CLI_SESSION_TTL_SECONDS, 600),
    pollIntervalSeconds: parseIntOrDefault(process.env.CLI_POLL_INTERVAL_SECONDS, 5),
    pollMaxAttempts: parseIntOrDefault(process.env.CLI_POLL_MAX_ATTEMPTS, 360),
  };
}

export function getAppBaseUrl(request?: NextRequest): string {
  const explicit = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) {
    return normalizeBaseUrl(explicit);
  }

  if (!request) {
    throw new Error(
      "APP_BASE_URL (or NEXT_PUBLIC_APP_URL) is required when request context is unavailable",
    );
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (host) {
    const protocol = forwardedProto || "https";
    return normalizeBaseUrl(`${protocol}://${host}`);
  }

  return normalizeBaseUrl(request.nextUrl.origin);
}
