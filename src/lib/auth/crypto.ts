import crypto from "node:crypto";
import { getTokenConfig } from "./config";

function parseEncryptionKey(): Buffer {
  const key = Buffer.from(getTokenConfig().tokenEncryptionKey, "base64");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  }
  return key;
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hashRefreshToken(refreshToken: string): string {
  const pepper = getTokenConfig().refreshTokenPepper;
  return sha256Hex(`${pepper}:${refreshToken}`);
}

export function encryptSecret(plaintext: string): string {
  const key = parseEncryptionKey();
  const keyVersion = getTokenConfig().tokenEncryptionKeyVersion;
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    keyVersion,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptSecret(payload: string): string {
  const key = parseEncryptionKey();
  const [keyVersion, ivB64, tagB64, encryptedB64] = payload.split(".");

  if (!keyVersion || !ivB64 || !tagB64 || !encryptedB64) {
    throw new Error("Invalid encrypted payload format");
  }

  const iv = Buffer.from(ivB64, "base64url");
  const authTag = Buffer.from(tagB64, "base64url");
  const encrypted = Buffer.from(encryptedB64, "base64url");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
