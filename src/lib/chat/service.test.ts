import { describe, expect, it } from "vitest";
import { ChatError, createChatService, type ChatMessage, type ChatSession, type ChatStore } from "./service";

const OWNER = 111;
const TOKEN = "a".repeat(40);

function memoryStore(): ChatStore {
  const sessions = new Map<string, ChatSession>();
  const messages: { sessionId: string; message: ChatMessage }[] = [];
  const links = new Map<number, string>();
  return {
    getSession: async (id) => sessions.get(id) ?? null,
    saveSession: async (s) => void sessions.set(s.id, s),
    addMessage: async (sessionId, sender, body) => {
      const message = { id: String(messages.length + 1), sender, body, createdAt: new Date().toISOString() };
      messages.push({ sessionId, message });
      return message;
    },
    listMessages: async (sessionId) => messages.filter((m) => m.sessionId === sessionId).map((m) => m.message),
    countVisitorMessagesSince: async (sessionId) =>
      messages.filter((m) => m.sessionId === sessionId && m.message.sender === "visitor").length,
    linkTelegramMessage: async (id, sessionId) => void links.set(id, sessionId),
    sessionForTelegramMessage: async (id) => links.get(id) ?? null,
  };
}

function setup(ownerChatId: number | null = OWNER) {
  const calls: { method: string; body: Record<string, unknown> }[] = [];
  const broadcasts: { sessionId: string; message: ChatMessage }[] = [];
  let nextId = 1000;
  const service = createChatService({
    store: memoryStore(),
    tg: async (method, body) => {
      calls.push({ method, body });
      return { message_id: nextId++ };
    },
    broadcast: async (sessionId, message) => void broadcasts.push({ sessionId, message }),
    config: { ownerChatId },
  });
  const fromOwner = (message_id: number, text: string, replyTo?: number) =>
    service.handleUpdate({
      message: { message_id, chat: { id: OWNER, type: "private" }, text, reply_to_message: replyTo ? { message_id: replyTo } : undefined },
    });
  return { service, calls, broadcasts, fromOwner };
}

describe("chat service", () => {
  it("relays a web visitor message to the owner and broadcasts the reply", async () => {
    const { service, calls, broadcasts, fromOwner } = setup();

    const res = await service.postVisitorMessage({ token: TOKEN, body: " Hello! ", name: "Ann" });
    expect(res.delivered).toBe(true);
    expect(calls[0].body.chat_id).toBe(OWNER);
    expect(calls[0].body.text).toContain("Ann");

    const { channel, messages } = await service.history(TOKEN);
    expect(messages.map((m) => m.body)).toEqual(["Hello!"]);

    await fromOwner(5, "Hi Ann", 1000);
    const reply = broadcasts.at(-1)!;
    expect(reply.sessionId).toBe(channel);
    expect(reply.message).toMatchObject({ sender: "owner", body: "Hi Ann" });
    expect(calls.at(-1)!.method).toBe("setMessageReaction");
  });

  it("relays Telegram users both ways and keeps the thread on reply-to-own-answer", async () => {
    const { service, calls, fromOwner } = setup();
    await service.handleUpdate({
      message: { message_id: 1, chat: { id: 222, type: "private" }, from: { first_name: "Bob", username: "bob" }, text: "yo" },
    });
    expect(calls.at(-1)!.body).toMatchObject({ chat_id: OWNER });
    expect(calls.at(-1)!.body.text).toContain("@bob");

    await fromOwner(6, "hey Bob", 1000);
    await fromOwner(7, "again", 6);
    const toBob = calls.filter((c) => c.method === "sendMessage" && c.body.chat_id === 222).map((c) => c.body.text);
    expect(toBob).toEqual(["hey Bob", "again"]);
  });

  it("tells the owner their chat id on /start before setup", async () => {
    const { service, calls } = setup(null);
    await service.handleUpdate({ message: { message_id: 1, chat: { id: 333, type: "private" }, text: "/start" } });
    expect(calls[0].body.text).toContain("TELEGRAM_OWNER_CHAT_ID=333");
  });

  it("rejects bad tokens and empty bodies", async () => {
    const { service } = setup();
    await expect(service.postVisitorMessage({ token: "short", body: "hi" })).rejects.toBeInstanceOf(ChatError);
    await expect(service.postVisitorMessage({ token: TOKEN, body: "   " })).rejects.toMatchObject({ status: 400 });
  });

  it("rate-limits chatty visitors", async () => {
    const { service } = setup();
    for (let i = 0; i < 20; i++) await service.postVisitorMessage({ token: TOKEN, body: `m${i}` });
    await expect(service.postVisitorMessage({ token: TOKEN, body: "one more" })).rejects.toMatchObject({ status: 429 });
  });
});
