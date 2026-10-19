import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Daily Vercel cron: a free Supabase project is paused after 7 days without activity,
// which would silently break the chat and the ADVNCD login broker.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { error } = await supabaseAdmin.from("chat_sessions").select("id", { head: true, count: "exact" });
  if (error) {
    console.error("keepalive failed", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
