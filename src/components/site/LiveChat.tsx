"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Msg = { id: string; sender: "visitor" | "owner"; body: string };

function getToken() {
  try {
    let t = localStorage.getItem("chat_token");
    if (!t) {
      t = crypto.randomUUID() + crypto.randomUUID();
      localStorage.setItem("chat_token", t);
    }
    return t;
  } catch {
    // storage blocked: chat still works for this page view
    return crypto.randomUUID() + crypto.randomUUID();
  }
}

const merge = (prev: Msg[], next: Msg[]) => {
  const seen = new Set(prev.map((m) => m.id));
  const add = next.filter((m) => !seen.has(m.id));
  return add.length ? [...prev, ...add].sort((a, b) => Number(a.id) - Number(b.id)) : prev;
};

export function LiveChat() {
  const [token, setToken] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pending, setPending] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"connecting" | "live" | "offline">("connecting");
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => setToken(getToken()), []);

  useEffect(() => {
    if (!token) return;
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let closed = false;
    (async () => {
      try {
        const r = await fetch(`/api/chat?token=${token}`);
        if (!r.ok) throw new Error();
        const { channel: name, messages } = (await r.json()) as { channel: string; messages: Msg[] };
        setMsgs((m) => merge(m, messages));
        if (closed) return;
        // replies are pushed over Realtime; the channel name is derived from this visitor's secret token
        channel = supabase
          .channel(`chat:${name}`)
          .on("broadcast", { event: "message" }, ({ payload }) => setMsgs((m) => merge(m, [payload as Msg])))
          .subscribe((s) => setStatus(s === "SUBSCRIBED" ? "live" : s === "CLOSED" ? "offline" : "connecting"));
      } catch {
        setStatus("offline");
      }
    })();
    return () => {
      closed = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [token]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [msgs.length, pending.length]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!token || !body) return;
    setText("");
    setError(null);
    setPending((p) => [...p, body]);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, body, name: name.trim() || undefined }),
      });
      if (!r.ok) throw new Error(r.status === 429 ? "Too many messages — please wait a few minutes." : "Message not sent.");
      const { message } = (await r.json()) as { message: Msg };
      setMsgs((m) => merge(m, [message]));
    } catch (err) {
      setText(body);
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Message not sent — check your connection.");
    } finally {
      setPending((p) => p.filter((x) => x !== body));
    }
  };

  const statusLabel = { live: "● usually replies within hours", connecting: "◌ connecting…", offline: "○ chat offline — use email" }[status];

  return (
    <div className="panel glow flex h-[480px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-2.5 font-mono text-xs text-muted-foreground">
        <span>chat · andrei</span><span className={status === "live" ? "text-signal" : "text-warn"}>{statusLabel}</span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.length === 0 && pending.length === 0 && <p className="msg-in max-w-[80%] rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">Hi! Ask me about a talk, a workshop or AI adoption in your team.</p>}
        {msgs.map((m) => (
          <div key={m.id} className={`msg-in flex ${m.sender === "visitor" ? "justify-end" : ""}`}>
            <p className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${m.sender === "visitor" ? "bg-secondary" : "bg-accent text-accent-foreground"}`}>{m.body}</p>
          </div>
        ))}
        {pending.map((body, i) => (
          <div key={`p${i}`} className="flex justify-end">
            <p className="max-w-[80%] whitespace-pre-wrap rounded-lg bg-secondary px-3 py-2 text-sm opacity-60">{body}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {error && <p className="border-t px-4 py-2 text-sm text-destructive">{error}</p>}
      <form onSubmit={submit} className="flex flex-col gap-2 border-t p-3 sm:flex-row">
        {msgs.length === 0 && (
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Your name" className="rounded-md border bg-background px-3 py-2 text-sm sm:w-36" />
        )}
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Type a message…" disabled={status === "offline"} className="flex-1 rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-50" />
        <button disabled={!text.trim() || status === "offline"} className="rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground disabled:opacity-50">send</button>
      </form>
    </div>
  );
}
