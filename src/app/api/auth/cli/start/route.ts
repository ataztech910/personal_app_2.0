import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createCliLoginSession } from "@/lib/auth/db";
import { getAppBaseUrl, getCliFlowConfig } from "@/lib/auth/config";
import { logAuditEvent } from "@/lib/auth/audit";
import { getRequestIp, getRequestUserAgent } from "@/lib/auth/request";

export async function POST(request: NextRequest) {
  const flow = getCliFlowConfig();
  const expiresAt = new Date(Date.now() + flow.cliSessionTtlSeconds * 1000);
  const sessionId = randomUUID();

  let payload: { device_name?: string } = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const deviceName =
    typeof payload.device_name === "string" ? payload.device_name.slice(0, 120) : undefined;

  await createCliLoginSession({
    sessionId,
    deviceName,
    expiresAt: expiresAt.toISOString(),
    ip: getRequestIp(request),
    userAgent: getRequestUserAgent(request),
  });

  const verifyUrl =
    `${getAppBaseUrl(request)}/advncd/verify?session_id=${encodeURIComponent(sessionId)}`;

  await logAuditEvent({
    eventType: "cli_login_started",
    request,
    sessionId,
    meta: {
      device_name: deviceName || null,
    },
  });

  return NextResponse.json({
    session_id: sessionId,
    verify_url: verifyUrl,
    expires_in: flow.cliSessionTtlSeconds,
    interval_seconds: flow.pollIntervalSeconds,
  });
}
