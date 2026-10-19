import { NextResponse } from "next/server";
import { getChatService } from "@/lib/chat";
import { ChatError } from "@/lib/chat/service";

function errorResponse(err: unknown) {
  if (err instanceof ChatError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "chat unavailable" }, { status: 500 });
}

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get("token");
    return NextResponse.json(await getChatService().history(token));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));
    return NextResponse.json(await getChatService().postVisitorMessage(data));
  } catch (err) {
    return errorResponse(err);
  }
}
