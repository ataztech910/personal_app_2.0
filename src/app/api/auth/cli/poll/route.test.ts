import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type CliLoginSessionRow } from "@/lib/auth/types";

const mocks = vi.hoisted(() => ({
  getCliLoginSession: vi.fn(),
  updateCliLoginSession: vi.fn(),
  getUserById: vi.fn(),
  createAppTokenRecord: vi.fn(),
  logAuditEvent: vi.fn(),
  signAppAccessToken: vi.fn(),
  generateAppRefreshToken: vi.fn(),
}));

vi.mock("@/lib/auth/db", () => ({
  getCliLoginSession: mocks.getCliLoginSession,
  updateCliLoginSession: mocks.updateCliLoginSession,
  getUserById: mocks.getUserById,
  createAppTokenRecord: mocks.createAppTokenRecord,
}));

vi.mock("@/lib/auth/audit", () => ({
  logAuditEvent: mocks.logAuditEvent,
}));

vi.mock("@/lib/auth/tokens", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth/tokens")>("@/lib/auth/tokens");
  return {
    ...actual,
    signAppAccessToken: mocks.signAppAccessToken,
    generateAppRefreshToken: mocks.generateAppRefreshToken,
  };
});

import { GET } from "./route";

function buildSession(partial?: Partial<CliLoginSessionRow>): CliLoginSessionRow {
  return {
    id: 1,
    session_id: "session-1",
    status: "pending",
    device_name: null,
    user_id: null,
    expires_at: new Date(Date.now() + 60_000).toISOString(),
    created_at: new Date().toISOString(),
    approved_at: null,
    denied_at: null,
    oauth_state_hash: null,
    oauth_nonce: null,
    oauth_started_at: null,
    poll_count: 0,
    last_poll_at: null,
    ip: null,
    user_agent: null,
    ...partial,
  };
}

describe("GET /api/auth/cli/poll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = "id";
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    process.env.GOOGLE_REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";
    process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 1).toString("base64");
    process.env.APP_JWT_SECRET = "super-secret";
    process.env.REFRESH_TOKEN_PEPPER = "pepper";
    process.env.CLI_POLL_INTERVAL_SECONDS = "1";
    process.env.CLI_POLL_MAX_ATTEMPTS = "10";
    process.env.APP_REFRESH_TOKEN_TTL_SECONDS = "3600";
    process.env.APP_ACCESS_TOKEN_TTL_SECONDS = "900";

    mocks.updateCliLoginSession.mockResolvedValue({});
    mocks.logAuditEvent.mockResolvedValue(undefined);
  });

  it("returns pending when session is pending", async () => {
    mocks.getCliLoginSession.mockResolvedValue(buildSession({ status: "pending" }));

    const request = new NextRequest(
      "http://localhost:3000/api/auth/cli/poll?session_id=session-1",
    );

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ status: "pending" });
  });

  it("returns approved with app tokens when session is approved", async () => {
    mocks.getCliLoginSession.mockResolvedValue(
      buildSession({ status: "approved", user_id: "user-1" }),
    );
    mocks.getUserById.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
    });
    mocks.signAppAccessToken.mockResolvedValue("app-access-token");
    mocks.generateAppRefreshToken.mockReturnValue("app-refresh-token");
    mocks.createAppTokenRecord.mockResolvedValue({});

    const request = new NextRequest(
      "http://localhost:3000/api/auth/cli/poll?session_id=session-1",
    );

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.status).toBe("approved");
    expect(json.app_access_token).toBe("app-access-token");
    expect(json.app_refresh_token).toBe("app-refresh-token");
    expect(json.email).toBe("user@example.com");
  });
});
