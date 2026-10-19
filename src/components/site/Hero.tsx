"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import photo from "@/assets/andrei.jpg";

const chat = [
  { who: "you", text: "Who is Andrei?" },
  { who: "ai", text: "Andrei helps teams adopt AI and see what's really happening in production through observability. He speaks at conferences like DevWorld and has written three books." },
  { who: "you", text: "Can he help my team?" },
  { who: "ai", text: "Yes — consulting, workshops and hands-on implementation. Based in Linz, works worldwide in English and Russian." },
];

export function Hero() {
  const [n, setN] = useState(1);
  useEffect(() => {
    if (n >= chat.length) return;
    const t = setTimeout(() => setN(n + 1), 1100);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col justify-center">
        <p className="font-mono text-xs text-signal">$ whoami</p>
        <h1 className="mt-3 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          AI adoption.<br /><span className="text-signal">Observability.</span><br />Speaker & author.
        </h1>
        <p className="mt-5 max-w-lg text-lg text-muted-foreground">I&apos;m Andrei Tazetdinov — I help engineering teams bring AI into production and make it measurable, traceable and reliable.</p>
        <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
          <a href="#talks" className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">Watch talks</a>
          <Link href="/contact" className="rounded-md border px-4 py-2 hover:bg-secondary">Work with me</Link>
        </div>
      </div>
      <div className="panel glow flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2.5 font-mono text-xs text-muted-foreground">
          <span>ask-andrei · model: human-1</span>
          <span className="text-signal">● live</span>
        </div>
        <div className="flex-1 space-y-3 p-4">
          {chat.slice(0, n).map((m, i) => (
            <div key={i} className={`msg-in flex gap-2 ${m.who === "you" ? "justify-end" : ""}`}>
              {m.who === "ai" && <Image src={photo} alt="Andrei Tazetdinov" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover object-top" />}
              <p className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.who === "you" ? "bg-secondary" : "bg-accent text-accent-foreground"}`}>{m.text}</p>
            </div>
          ))}
          {n < chat.length && <p className="font-mono text-xs text-muted-foreground caret">thinking</p>}
        </div>
        <div className="border-t p-3">
          <Link href="/contact" className="block rounded-md border bg-background px-3 py-2 font-mono text-sm text-muted-foreground caret hover:border-signal/60">Ask about a talk, a workshop…</Link>
        </div>
      </div>
    </section>
  );
}
