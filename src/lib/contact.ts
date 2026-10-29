import { sendEmail } from "@/lib/mail";
import { userAutoReplyTemplate } from "@/lib/emailTemplates";

export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter?: boolean;
};

/** Shared delivery for the website and MCP. Recipient is always server-configured. */
export async function deliverContactMessage(input: ContactMessage, idempotencyKey?: string) {
  const ownerEmail = process.env.CONTACT_RECEIVER;
  const fromEmail = process.env.MAIL_FROM;
  if (!ownerEmail || !fromEmail) throw new Error("Contact email is not configured");

  await sendEmail({
    from: `Website Contact <${fromEmail}>`,
    to: ownerEmail,
    replyTo: input.email,
    subject: `📩 ${input.subject}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\nNewsletter: ${input.newsletter ? "yes" : "no"}\n\n${input.message}`,
  }, idempotencyKey ? `${idempotencyKey}/owner` : undefined);

  await sendEmail({
    from: `Andrei Tazetdinov <${fromEmail}>`,
    to: input.email,
    subject: "Thanks! I’ll get back to you soon",
    text: `Hi ${input.name},\n\nThanks for reaching out! I received your message and will reply as soon as possible.\n\n— Andrei`,
    html: userAutoReplyTemplate({ name: input.name }),
  }, idempotencyKey ? `${idempotencyKey}/reply` : undefined)
    .catch(() => console.error("Contact auto-reply not sent"));
}
