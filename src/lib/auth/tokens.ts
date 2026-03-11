import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { getTokenConfig } from "./config";
import { randomToken } from "./crypto";

export type AppAccessClaims = JWTPayload & {
  typ: "app_access";
  sub: string;
  email: string;
  sid?: string;
};

function getJwtSecret(): Uint8Array {
  const secret = getTokenConfig().appJwtSecret;
  return new TextEncoder().encode(secret);
}

export async function signAppAccessToken(input: {
  userId: string;
  email: string;
  sessionId?: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = getTokenConfig().appAccessTokenTtlSeconds;

  const payload: AppAccessClaims = {
    typ: "app_access",
    sub: input.userId,
    email: input.email,
    sid: input.sessionId,
    iat: now,
    nbf: now - 5,
    exp: now + expiresIn,
    jti: randomToken(16),
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .setNotBefore(now - 5)
    .sign(getJwtSecret());
}

export async function verifyAppAccessToken(token: string): Promise<AppAccessClaims> {
  const verified = await jwtVerify(token, getJwtSecret(), {
    algorithms: ["HS256"],
  });

  const payload = verified.payload as AppAccessClaims;
  if (payload.typ !== "app_access" || !payload.sub || !payload.email) {
    throw new Error("Invalid app access token payload");
  }

  return payload;
}

export function generateAppRefreshToken(): string {
  return randomToken(48);
}

export function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    return null;
  }

  return token;
}
