import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Broadcast, ChatMessage, ChatSession, ChatStore } from "./service";

type MessageRow = { id: number; sender: ChatMessage["sender"]; body: string; created_at: string };
type SessionRow = { id: string; kind: ChatSession["kind"]; name: string | null; tg_chat_id: number | null };

function throwIfError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

const toMessage = (r: MessageRow): ChatMessage => ({ id: String(r.id), sender: r.sender, body: r.body, createdAt: r.created_at });

export const realtimeChannel = (sessionId: string) => `chat:${sessionId}`;

export const supabaseChatStore: ChatStore = {
  async getSession(id) {
    const { data, error } = await supabaseAdmin
      .from("chat_sessions")
      .select("id, kind, name, tg_chat_id")
      .eq("id", id)
      .maybeSingle<SessionRow>();
    throwIfError(error);
    return data && { id: data.id, kind: data.kind, name: data.name, tgChatId: data.tg_chat_id };
  },

  async saveSession(s) {
    const { error } = await supabaseAdmin
      .from("chat_sessions")
      .upsert({ id: s.id, kind: s.kind, name: s.name, tg_chat_id: s.tgChatId });
    throwIfError(error);
  },

  async addMessage(sessionId, sender, body) {
    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .insert({ session_id: sessionId, sender, body })
      .select("id, sender, body, created_at")
      .single<MessageRow>();
    throwIfError(error);
    return toMessage(data!);
  },

  async listMessages(sessionId, limit) {
    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, sender, body, created_at")
      .eq("session_id", sessionId)
      .order("id", { ascending: false })
      .limit(limit)
      .returns<MessageRow[]>();
    throwIfError(error);
    return (data ?? []).reverse().map(toMessage);
  },

  async countVisitorMessagesSince(sessionId, since) {
    const { count, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId)
      .eq("sender", "visitor")
      .gte("created_at", since.toISOString());
    throwIfError(error);
    return count ?? 0;
  },

  async linkTelegramMessage(tgMessageId, sessionId) {
    const { error } = await supabaseAdmin
      .from("chat_telegram_messages")
      .upsert({ tg_message_id: tgMessageId, session_id: sessionId });
    throwIfError(error);
  },

  async sessionForTelegramMessage(tgMessageId) {
    const { data, error } = await supabaseAdmin
      .from("chat_telegram_messages")
      .select("session_id")
      .eq("tg_message_id", tgMessageId)
      .maybeSingle<{ session_id: string }>();
    throwIfError(error);
    return data?.session_id ?? null;
  },
};

export const supabaseBroadcast: Broadcast = async (sessionId, message) => {
  const channel = supabaseAdmin.channel(realtimeChannel(sessionId));
  try {
    const r = await channel.httpSend("message", message);
    if (!r.success) throw new Error(`Realtime broadcast failed [${r.status}]: ${r.error}`);
  } finally {
    await supabaseAdmin.removeChannel(channel);
  }
};
