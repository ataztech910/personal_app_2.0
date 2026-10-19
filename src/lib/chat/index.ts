import { createChatService, telegramClient } from "./service";
import { supabaseBroadcast, supabaseChatStore } from "./supabase";

let service: ReturnType<typeof createChatService> | null = null;

export function getChatService() {
  if (!service) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error("Missing required environment variable: TELEGRAM_BOT_TOKEN");
    service = createChatService({
      store: supabaseChatStore,
      tg: telegramClient(botToken),
      broadcast: supabaseBroadcast,
      config: { ownerChatId: Number(process.env.TELEGRAM_OWNER_CHAT_ID) || null },
    });
  }
  return service;
}
