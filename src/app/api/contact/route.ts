import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { userAutoReplyTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const ownerEmail = process.env.CONTACT_RECEIVER!;
    const fromEmail = process.env.MAIL_FROM ?? process.env.SMTP_USER!; // что будет в From

    // 1) письмо тебе
    await transporter.sendMail({
      from: `"Website Contact" <${fromEmail}>`,
      to: ownerEmail,
      replyTo: email,
      subject: `📩 ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    // 2) автоответ пользователю
    await transporter.sendMail({
        from: `"Andrei Tazetdinov" <${fromEmail}>`,
        to: email,
        subject: "Thanks! I’ll get back to you soon",
        text: `Hi ${name},\n\nThanks for reaching out! I received your message and will reply as soon as possible.\n\n— Andrei`,
        html: userAutoReplyTemplate({ name }), // ✅ красивый HTML
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Mail not sent" }, { status: 500 });
  }
}