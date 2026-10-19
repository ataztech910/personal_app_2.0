// Live chat relay: website visitors and Telegram users write to the bot,
// the owner answers from Telegram by replying to the forwarded message.

export type Sender = "visitor" | "owner";
export type ChatMessage = { id: string; sender: Sender; body: string; createdAt: string };
export type ChatSession = { id: string; kind: "web" | "tg"; name: string | null; tgChatId: number | null };

export interface ChatStore {
  getSession(id: string): Promise<ChatSession | null>;
  saveSession(session: ChatSession): Promise<void>;
  addMessage(sessionId: string, sender: Sender, body: string): Promise<ChatMessage>;
  listMessages(sessionId: string, limit: number): Promise<ChatMessage[]>;
  countVisitorMessagesSince(sessionId: string, since: Date): Promise<number>;
  linkTelegramMessage(tgMessageId: number, sessionId: string): Promise<void>;
  sessionForTelegramMessage(tgMessageId: number): Promise<string | null>;
}

export type TelegramCall = (method: string, body: Record<string, unknown>) => Promise<{ message_id: number }>;

type TgMessage = {
  message_id: number;
  chat: { id: number; type: string };
  from?: { first_name?: string; last_name?: string; username?: string };
  text?: string;
  reply_to_message?: { message_id: number };
};
export type Broadcast = (sessionId: string, message: ChatMessage) => Promise<void>;

export type ChatConfig = { ownerChatId: number | null };

export class ChatError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const MAX_BODY = 2000;
const RATE_LIMIT = 20; // visitor messages per window
const RATE_WINDOW_MS = 10 * 60 * 1000;

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Session id for a browser token. Doubles as the Realtime channel name, so it is only shown to the token holder. */
export const webSessionId = async (token: string) => "w" + (await sha256(`chat:${token}`)).slice(0, 31);

export const isValidToken = (t: unknown): t is string => typeof t === "string" && t.length >= 20 && t.length <= 100;

export function telegramClient(botToken: string): TelegramCall {
  return async (method, body) => {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(`Telegram ${method} failed: ${json.description ?? res.status}`);
    return json.result;
  };
}

export function createChatService({ store, tg, broadcast, config }: {
  store: ChatStore;
  tg: TelegramCall;
  broadcast: Broadcast;
  config: ChatConfig;
}) {
  async function addAndBroadcast(sessionId: string, sender: Sender, body: string) {
    const msg = await store.addMessage(sessionId, sender, body);
    await broadcast(sessionId, msg).catch((e) => console.error("chat broadcast failed", e));
    return msg;
  }

  /** Sends a notification to the owner and remembers which session it belongs to. */
  async function notifyOwner(sessionId: string, text: string) {
    if (!config.ownerChatId) return null;
    try {
      const r = await tg("sendMessage", { chat_id: config.ownerChatId, text });
      await store.linkTelegramMessage(r.message_id, sessionId);
      return r.message_id;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // ---------- website ----------

  async function postVisitorMessage(input: { token: unknown; body: unknown; name?: unknown }) {
    const body = typeof input.body === "string" ? input.body.trim().slice(0, MAX_BODY) : "";
    if (!isValidToken(input.token) || !body) throw new ChatError("invalid request", 400);
    const name = typeof input.name === "string" ? input.name.trim().slice(0, 100) || null : null;

    const sessionId = await webSessionId(input.token);
    let session = await store.getSession(sessionId);
    if (!session) {
      session = { id: sessionId, kind: "web", name, tgChatId: null };
      await store.saveSession(session);
    } else if (name && !session.name) {
      session = { ...session, name };
      await store.saveSession(session);
    }

    const recent = await store.countVisitorMessagesSince(sessionId, new Date(Date.now() - RATE_WINDOW_MS));
    if (recent >= RATE_LIMIT) throw new ChatError("too many messages", 429);

    const message = await addAndBroadcast(sessionId, "visitor", body);
    const delivered = await notifyOwner(
      sessionId,
      `💬 ${session.name || "Visitor"} · web #${sessionId.slice(1, 9)}\n\n${body}\n\n↩︎ Reply to this message to answer.`,
    );
    return { message, delivered: delivered !== null };
  }

  async function history(token: unknown) {
    if (!isValidToken(token)) throw new ChatError("invalid token", 400);
    const channel = await webSessionId(token);
    return { channel, messages: await store.listMessages(channel, 200) };
  }

  // ---------- Telegram webhook ----------

  async function handleUpdate(update: unknown) {
    const msg = (update as { message?: TgMessage } | null)?.message;
    if (!msg || msg.chat?.type !== "private") return;
    try {
      if (msg.chat.id === config.ownerChatId) await fromOwner(msg);
      else await fromTelegramUser(msg);
    } catch (e) {
      console.error(e);
    }
  }

  async function fromTelegramUser(msg: TgMessage) {
    const chatId: number = msg.chat.id;
    if (msg.text?.startsWith("/start")) {
      // until TELEGRAM_OWNER_CHAT_ID is set, /start tells the owner which id to configure
      const setup = config.ownerChatId ? "" : `\n\nSetup: TELEGRAM_OWNER_CHAT_ID=${chatId}`;
      await tg("sendMessage", { chat_id: chatId, text: "Hi! Write your message here and Andrei will answer you in this chat." + setup });
      return;
    }
    if (!config.ownerChatId) return;

    const sessionId = `t${chatId}`;
    const from = msg.from ?? {};
    const name = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Telegram user";
    if (!(await store.getSession(sessionId))) {
      await store.saveSession({ id: sessionId, kind: "tg", name, tgChatId: chatId });
    }
    const header = `👤 ${name}${from.username ? ` (@${from.username})` : ""} · tg #${chatId}`;
    if (msg.text) {
      await store.addMessage(sessionId, "visitor", String(msg.text).slice(0, 4000));
      await notifyOwner(sessionId, `${header}\n\n${msg.text}\n\n↩︎ Reply to this message to answer.`);
    } else {
      // photos, voice, files: forward as a copy with a header so the owner can reply to either message
      await notifyOwner(sessionId, header);
      const copy = await tg("copyMessage", { chat_id: config.ownerChatId, from_chat_id: chatId, message_id: msg.message_id });
      await store.linkTelegramMessage(copy.message_id, sessionId);
    }
  }

  async function fromOwner(msg: TgMessage) {
    const ownerId = config.ownerChatId!;
    if (msg.text?.startsWith("/start") || msg.text?.startsWith("/help")) {
      await tg("sendMessage", {
        chat_id: ownerId,
        text: "✅ You are the owner. Messages from the website chat and from Telegram users arrive here.\nReply to a message to answer that person.",
      });
      return;
    }
    const replyTo = msg.reply_to_message?.message_id;
    const sessionId = replyTo ? await store.sessionForTelegramMessage(replyTo) : null;
    if (!sessionId) {
      await tg("sendMessage", { chat_id: ownerId, text: replyTo ? "Couldn't find that chat." : "Reply to a visitor's message to answer them." });
      return;
    }
    const session = await store.getSession(sessionId);
    if (!session) return;

    if (session.kind === "tg") {
      if (msg.text) {
        await tg("sendMessage", { chat_id: session.tgChatId, text: msg.text });
        await store.addMessage(sessionId, "owner", String(msg.text).slice(0, 4000));
      } else {
        await tg("copyMessage", { chat_id: session.tgChatId, from_chat_id: ownerId, message_id: msg.message_id });
      }
    } else {
      if (!msg.text) {
        await tg("sendMessage", { chat_id: ownerId, text: "Website visitors can only receive text." });
        return;
      }
      await addAndBroadcast(sessionId, "owner", String(msg.text).slice(0, 4000));
    }
    // replying to your own answer keeps the thread going
    await store.linkTelegramMessage(msg.message_id, sessionId);
    await tg("setMessageReaction", { chat_id: ownerId, message_id: msg.message_id, reaction: [{ type: "emoji", emoji: "👌" }] }).catch(() => {});
  }

  return { postVisitorMessage, history, handleUpdate };
}
