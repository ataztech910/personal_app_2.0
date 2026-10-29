import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Andrei Tazetdinov Assistant — Privacy" };

export default function ContactPrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-12 md:px-6">
      <h1 className="text-3xl font-semibold">Andrei Tazetdinov Assistant: privacy</h1>
      <p className="text-sm text-muted-foreground">Updated October 29, 2026</p>
      <p>This page describes the profile and contact plugin operated by Andrei Tazetdinov at andreitazetdinov.com.</p>
      <h2 className="text-xl font-semibold">Information sent to the website</h2>
      <p>Reading the public profile requires no name, email, or message. When the sending tool is called, the website receives your email address, optional name, subject, and message. The integration does not request your entire ChatGPT conversation or account profile. Basic technical request information may be processed by the hosting service for either tool.</p>
      <h2 className="text-xl font-semibold">How the information is used</h2>
      <p>The website uses your information to deliver your inquiry to Andrei, send a receipt to your supplied email, and allow Andrei to reply. It does not subscribe you to a newsletter or use your message to train an AI model through this integration.</p>
      <h2 className="text-xl font-semibold">Services involved</h2>
      <p>The website runs on Vercel and uses Resend to process and deliver emails. Your contact details and message are included in the email delivered to Andrei. ChatGPT processes your interaction under the terms and privacy settings of your OpenAI account.</p>
      <h2 className="text-xl font-semibold">Storage and logs</h2>
      <p>Messages and contact details remain in the recipient and sender mailboxes and may be retained by the email delivery service. The integration does not add messages to a separate application database. It temporarily keeps hashed sender/message identifiers and request counters in server memory to limit abuse and repeated sends. The code avoids intentionally logging message text or email addresses; hosting and delivery services may maintain their own operational records.</p>
      <h2 className="text-xl font-semibold">Questions and requests</h2>
      <p>For questions about your information or a request to delete correspondence held by Andrei, use the <Link className="underline" href="/contact?tab=email">website contact form</Link>. Include the email used for the inquiry so the correspondence can be located. Records held by your own email provider or OpenAI are managed through those services.</p>
      <Link className="inline-block underline" href="/chatgpt">Back to the plugin</Link>
    </main>
  );
}
