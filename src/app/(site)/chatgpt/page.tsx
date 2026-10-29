import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Andrei Tazetdinov Assistant — ChatGPT plugin",
  description: "Explore Andrei Tazetdinov's profile, consulting and talks, then send an approved inquiry from ChatGPT.",
};

export default function ChatGPTPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-12 md:px-6">
      <p className="font-mono text-xs text-signal">$ contact andrei</p>
      <h1 className="text-4xl font-semibold">Andrei Tazetdinov Assistant</h1>
      <p>Connect with Andrei Tazetdinov, software architect and React Native consultant. Explore his professional background, consulting, technical speaking engagements, and collaboration opportunities from ChatGPT.</p>
      <p>The plugin is being prepared for publication. It is not yet listed in the public directory.</p>
      <h2 className="text-2xl font-semibold">How it works</h2>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Ask about Andrei&apos;s experience, specializations, talks, or books. Profile questions need no email and send no message.</li>
        <li>If you want to get in touch, describe what you would like to discuss with Andrei.</li>
        <li>Provide your email so Andrei can reply. Your name is optional.</li>
        <li>Review your email, subject, and complete message in ChatGPT.</li>
        <li>Approve sending. The website sends an email to Andrei and a receipt to you.</li>
      </ol>
      <p>Profile answers use the information published on this website and include source links. Current availability, fees, and commitments must be confirmed with Andrei.</p>
      <p>Replies arrive at your email address. This is a contact service; it does not provide live chat inside ChatGPT, retrieve correspondence, take payments, or book meetings. Sending a message does not subscribe you to a newsletter.</p>
      <p>Your supplied email and approved message are shared with Andrei and processed through Resend for delivery. Please avoid including passwords or other sensitive information.</p>
      <nav className="flex flex-wrap gap-4 underline" aria-label="Plugin information">
        <Link href="/contact?tab=email">Contact and support</Link>
        <Link href="/chatgpt/privacy">Privacy</Link>
        <Link href="/chatgpt/terms">Terms</Link>
      </nav>
    </main>
  );
}
