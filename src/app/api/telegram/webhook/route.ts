import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getChatService } from "@/lib/chat";

function validSecret(received: string | null) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!validSecret(req.headers.get("X-Telegram-Bot-Api-Secret-Token"))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const update = await req.json().catch(() => null);
  // always 200: Telegram retries failed updates, and errors are already logged
  await getChatService().handleUpdate(update);
  return NextResponse.json({ ok: true });
}
