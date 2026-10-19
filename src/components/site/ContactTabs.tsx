"use client";
import { useEffect, useState } from "react";
import { LiveChat } from "./LiveChat";

const BOT = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

export function ContactTabs() {
  const [tab, setTab] = useState<"chat" | "email">("chat");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "email") setTab("email");
  }, []);
  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-md border p-1 font-mono text-sm">
          {(["chat", "email"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded px-4 py-1.5 ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "chat" ? "● live chat" : "✉ email"}
            </button>
          ))}
        </div>
        {BOT && (
          <a href={`https://t.me/${BOT}`} target="_blank" rel="noreferrer" className="font-mono text-sm text-muted-foreground hover:text-signal">
            or message me on Telegram → @{BOT}
          </a>
        )}
      </div>
      <div className="mt-4">{tab === "chat" ? <LiveChat /> : <EmailForm />}</div>
    </>
  );
}

function EmailForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [f, setF] = useState({ name: "", email: "", message: "", newsletter: true });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!r.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  };
  if (state === "done") return <div className="panel p-8 text-center"><p className="font-mono text-signal">200 OK</p><p className="mt-2">Thanks! I&apos;ll get back to you by email soon.</p></div>;
  return (
    <form onSubmit={onSubmit} className="panel space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required maxLength={100} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Name" className="rounded-md border bg-background px-3 py-2 text-sm" />
        <input required type="email" maxLength={255} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Email" className="rounded-md border bg-background px-3 py-2 text-sm" />
      </div>
      <textarea required maxLength={2000} rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Your message" className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={f.newsletter} onChange={(e) => setF({ ...f, newsletter: e.target.checked })} className="accent-primary" />
        Subscribe to new articles and news
      </label>
      {state === "error" && <p className="text-sm text-destructive">Something went wrong — please check the fields and try again.</p>}
      <button disabled={state === "sending"} className="rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground disabled:opacity-50">{state === "sending" ? "sending…" : "send message"}</button>
    </form>
  );
}
