import { NextResponse } from "next/server";
import { deliverContactMessage } from "@/lib/contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));
    const name = String(data.name ?? "").trim().slice(0, 100);
    const email = String(data.email ?? "").trim().slice(0, 255);
    const message = String(data.message ?? "").trim().slice(0, 2000);
    const subject = String(data.subject ?? `Website message from ${name}`).slice(0, 200);

    if (!name || !EMAIL_RE.test(email) || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await deliverContactMessage({ name, email, subject, message, newsletter: Boolean(data.newsletter) });

    return NextResponse.json({ success: true });
  } catch {
    console.error("Contact delivery failed");
    return NextResponse.json({ error: "Mail not sent" }, { status: 500 });
  }
}
