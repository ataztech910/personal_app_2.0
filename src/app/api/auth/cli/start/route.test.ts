import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createCliLoginSession: vi.fn(),
  logAuditEvent: vi.fn(),
}));

vi.mock("@/lib/auth/db", () => ({
  createCliLoginSession: mocks.createCliLoginSession,
}));

vi.mock("@/lib/auth/audit", () => ({
  logAuditEvent: mocks.logAuditEvent,
}));

import { POST } from "./route";

describe("POST /api/auth/cli/start", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = "id";
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    process.env.GOOGLE_REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";
    process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 1).toString("base64");
    process.env.APP_JWT_SECRET = "super-secret";
    process.env.REFRESH_TOKEN_PEPPER = "pepper";
    process.env.APP_BASE_URL = "http://localhost:3000";

    mocks.createCliLoginSession.mockResolvedValue({});
    mocks.logAuditEvent.mockResolvedValue(undefined);
  });

  it("creates login session and returns verify_url", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/cli/start", {
      method: "POST",
      body: JSON.stringify({ device_name: "macbook" }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.session_id).toBeTypeOf("string");
    expect(json.verify_url).toContain("/advncd/verify?session_id=");
    expect(json.expires_in).toBeTypeOf("number");
    expect(json.interval_seconds).toBeTypeOf("number");
    expect(mocks.createCliLoginSession).toHaveBeenCalledTimes(1);
    expect(mocks.logAuditEvent).toHaveBeenCalledTimes(1);
  });
});
