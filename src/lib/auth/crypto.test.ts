import { beforeEach, describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret, hashRefreshToken } from "./crypto";

describe("auth crypto utilities", () => {
  beforeEach(() => {
    process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
    process.env.TOKEN_ENCRYPTION_KEY_VERSION = "v1";
    process.env.REFRESH_TOKEN_PEPPER = "test-pepper";
    process.env.APP_JWT_SECRET = "test-jwt-secret";
  });

  it("encrypts and decrypts secrets with AES-256-GCM", () => {
    const plaintext = "refresh-token-123";
    const encrypted = encryptSecret(plaintext);

    expect(encrypted).not.toEqual(plaintext);
    expect(decryptSecret(encrypted)).toEqual(plaintext);
  });

  it("hashes refresh token with pepper", () => {
    const hash1 = hashRefreshToken("token-a");
    const hash2 = hashRefreshToken("token-a");
    const hash3 = hashRefreshToken("token-b");

    expect(hash1).toEqual(hash2);
    expect(hash1).not.toEqual(hash3);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });
});
