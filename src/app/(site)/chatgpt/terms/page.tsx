import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Andrei Tazetdinov Assistant — Terms" };

export default function ContactTermsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-12 md:px-6">
      <h1 className="text-3xl font-semibold">Andrei Tazetdinov Assistant: terms</h1>
      <p className="text-sm text-muted-foreground">Updated October 29, 2026</p>
      <p>This plugin provides Andrei Tazetdinov&apos;s published professional profile and a way to send him professional inquiries through his personal website. No website account or payment is required.</p>
      <p>Profile information describes the experience, services, talks, and books published on the website. It does not confirm live availability, fees, or project commitments. Reading the profile does not send an inquiry or require contact details.</p>
      <h2 className="text-xl font-semibold">Sending a message</h2>
      <p>Provide an email address you are authorized to use. Review the recipient, sender email, subject, and complete message before approving a send in ChatGPT. Approval is handled by ChatGPT; the website does not independently verify the conversation. Once accepted for delivery, an email cannot be recalled through the plugin.</p>
      <h2 className="text-xl font-semibold">Appropriate use</h2>
      <p>Use the plugin for relevant inquiries such as software engineering, consulting, speaking, or collaboration. Do not use it to send spam, impersonate others, or send unlawful or abusive content. Do not include credentials or information you are not authorized to share.</p>
      <h2 className="text-xl font-semibold">Delivery and replies</h2>
      <p>A successful tool result means the email service accepted the message; it does not guarantee inbox delivery or a reply. Replies are sent to your supplied email address. Sending an inquiry does not create a booking, purchase, or agreement to provide services.</p>
      <h2 className="text-xl font-semibold">Availability and limits</h2>
      <p>This is an initial version. Requests may fail, be rate limited, or be temporarily unavailable. Identical messages may be suppressed to prevent duplicate delivery. The plugin cannot retrieve past messages or replies.</p>
      <p>For assistance, use the <Link className="underline" href="/contact?tab=email">contact form</Link>. Read the <Link className="underline" href="/chatgpt/privacy">privacy information</Link> before sending personal details.</p>
      <Link className="inline-block underline" href="/chatgpt">Back to the plugin</Link>
    </main>
  );
}
