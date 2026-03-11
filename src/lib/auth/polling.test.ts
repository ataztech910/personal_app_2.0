import { beforeEach, describe, expect, it } from "vitest";
import { evaluatePollRateLimit, isSessionExpired } from "./polling";
import { type CliLoginSessionRow } from "./types";

function makeSession(partial?: Partial<CliLoginSessionRow>): CliLoginSessionRow {
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

describe("polling controls", () => {
  beforeEach(() => {
    process.env.CLI_POLL_INTERVAL_SECONDS = "5";
    process.env.CLI_POLL_MAX_ATTEMPTS = "3";
  });

  it("allows first poll", () => {
    const result = evaluatePollRateLimit(makeSession());
    expect(result.allowed).toBe(true);
  });

  it("blocks too-frequent poll", () => {
    const session = makeSession({ last_poll_at: new Date().toISOString(), poll_count: 1 });
    const result = evaluatePollRateLimit(session);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("blocks after max attempts", () => {
    const session = makeSession({ poll_count: 3 });
    const result = evaluatePollRateLimit(session);
    expect(result.allowed).toBe(false);
  });

  it("detects expiration", () => {
    expect(isSessionExpired(new Date(Date.now() - 1000).toISOString())).toBe(true);
    expect(isSessionExpired(new Date(Date.now() + 1000).toISOString())).toBe(false);
  });
});
