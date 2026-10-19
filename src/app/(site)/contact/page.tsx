import type { Metadata } from "next";
import { ContactTabs } from "@/components/site/ContactTabs";

export const metadata: Metadata = {
  title: "Contact — Andrei Tazetdinov",
  description: "Chat live with Andrei Tazetdinov or send an email. Subscribe to new articles and news.",
  openGraph: {
    title: "Contact — Andrei Tazetdinov",
    description: "Live chat or email — talks, workshops, AI adoption and observability consulting.",
    type: "website",
  },
  twitter: { card: "summary" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="font-mono text-xs text-signal">$ ping andrei</p>
      <h1 className="mt-2 text-4xl font-semibold">Let&apos;s talk</h1>
      <p className="mt-2 text-muted-foreground">Write in the chat and I&apos;ll answer right here — or send a classic email.</p>
      <ContactTabs />
    </main>
  );
}
