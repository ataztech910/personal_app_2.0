import { getCliFlowConfig } from "./config";
import { type CliLoginSessionRow } from "./types";

export function isSessionExpired(expiresAtIso: string): boolean {
  return Date.now() >= new Date(expiresAtIso).getTime();
}

export function evaluatePollRateLimit(session: CliLoginSessionRow): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const flow = getCliFlowConfig();

  if (session.poll_count >= flow.pollMaxAttempts) {
    return {
      allowed: false,
      retryAfterSeconds: flow.pollIntervalSeconds,
    };
  }

  if (!session.last_poll_at) {
    return { allowed: true };
  }

  const lastPollMs = new Date(session.last_poll_at).getTime();
  const intervalMs = flow.pollIntervalSeconds * 1000;
  const elapsed = Date.now() - lastPollMs;

  if (elapsed >= intervalMs) {
    return { allowed: true };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((intervalMs - elapsed) / 1000));
  return { allowed: false, retryAfterSeconds };
}
