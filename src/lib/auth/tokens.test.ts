import { beforeEach, describe, expect, it } from "vitest";
import {
  extractBearerToken,
  generateAppRefreshToken,
  signAppAccessToken,
  verifyAppAccessToken,
} from "./tokens";

describe("app token helpers", () => {
  beforeEach(() => {
    process.env.APP_JWT_SECRET = "super-test-secret-with-very-long-length";
    process.env.APP_ACCESS_TOKEN_TTL_SECONDS = "900";
    process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 8).toString("base64");
    process.env.REFRESH_TOKEN_PEPPER = "pepper";
  });

  it("signs and verifies app access token", async () => {
    const token = await signAppAccessToken({
      userId: "user-1",
      email: "user@example.com",
      sessionId: "session-1",
    });

    const claims = await verifyAppAccessToken(token);
    expect(claims.sub).toBe("user-1");
    expect(claims.email).toBe("user@example.com");
    expect(claims.sid).toBe("session-1");
    expect(claims.typ).toBe("app_access");
  });

  it("extracts bearer token", () => {
    expect(extractBearerToken("Bearer abc")).toBe("abc");
    expect(extractBearerToken("bearer xyz")).toBe("xyz");
    expect(extractBearerToken("Basic aaa")).toBeNull();
    expect(extractBearerToken(null)).toBeNull();
  });

  it("generates refresh token", () => {
    const token = generateAppRefreshToken();
    expect(token.length).toBeGreaterThan(30);
  });
});
