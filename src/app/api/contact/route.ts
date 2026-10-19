import { NextResponse } from "next/server";
import { userAutoReplyTemplate } from "@/lib/emailTemplates";
import { sendEmail } from "@/lib/mail";

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

    const ownerEmail = process.env.CONTACT_RECEIVER!;
    const fromEmail = process.env.MAIL_FROM!; // address on a domain verified in Resend

    // 1) to the site owner
    await sendEmail({
      from: `Website Contact <${fromEmail}>`,
      to: ownerEmail,
      replyTo: email,
      subject: `📩 ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nNewsletter: ${data.newsletter ? "yes" : "no"}\n\n${message}`,
    });

    // 2) auto-reply to the visitor; best effort, the owner already has the message
    await sendEmail({
      from: `Andrei Tazetdinov <${fromEmail}>`,
      to: email,
      subject: "Thanks! I’ll get back to you soon",
      text: `Hi ${name},\n\nThanks for reaching out! I received your message and will reply as soon as possible.\n\n— Andrei`,
      html: userAutoReplyTemplate({ name }),
    }).catch((err) => console.error("auto-reply not sent", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Mail not sent" }, { status: 500 });
  }
}
