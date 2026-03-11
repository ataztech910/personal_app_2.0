import { type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getRequestIp, getRequestUserAgent } from "./request";

type AuditInput = {
  eventType: string;
  request?: NextRequest;
  userId?: string | null;
  sessionId?: string | null;
  meta?: Record<string, unknown>;
};

export async function logAuditEvent(input: AuditInput): Promise<void> {
  const actorIp = input.request ? getRequestIp(input.request) : null;
  const actorUserAgent = input.request ? getRequestUserAgent(input.request) : null;

  await supabaseAdmin.from("audit_events").insert({
    event_type: input.eventType,
    user_id: input.userId || null,
    session_id: input.sessionId || null,
    actor_ip: actorIp,
    actor_user_agent: actorUserAgent,
    meta: input.meta || {},
  });
}
