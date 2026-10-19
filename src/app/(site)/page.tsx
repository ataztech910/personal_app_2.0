import type { Metadata } from "next";
import Image from "next/image";
import photo from "@/assets/andrei.jpg";
import { Hero } from "@/components/site/Hero";
import { Label } from "@/components/site/Label";

export const metadata: Metadata = {
  title: "Andrei Tazetdinov — AI Adoption & Observability",
  description: "Andrei Tazetdinov helps teams adopt AI and build observability. Public speaker at DevWorld, author of three books on Next.js, 3D web and AI-assisted development.",
  openGraph: {
    title: "Andrei Tazetdinov — AI Adoption & Observability",
    description: "Speaker, author and consultant for AI adoption and production observability.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const talks = [
  { id: "Me0m6WMQ80g", title: "Killing Wasted Re-renders With Production Hook Instrumentation", tag: "observability" },
  { id: "UhSfwrvZNJc", title: "The New Frontend Stack: Humans, AI, and Prompts", tag: "ai" },
  { id: "l1mLz1DaWlw", title: "AST + AI = Developer Co-Pilot 2.0", tag: "ai" },
];

const services = [
  { k: "ai.adoption", t: "AI adoption", d: "Bringing LLMs, agents and AI-assisted workflows into real teams — from strategy to production." },
  { k: "observability", t: "Observability", d: "Instrumentation, tracing and metrics so you see what your apps and AI actually do in production." },
  { k: "fullstack", t: "Full stack & cross‑platform", d: "Next.js, Deno, Go, React Native, Tauri, Electron — scalable apps across web, mobile and desktop." },
  { k: "e2e", t: "E2E testing", d: "Playwright, Cypress, Detox, Maestro — confidence before every release." },
  { k: "edu", t: "Consulting & education", d: "Architecture reviews, workshops and team training." },
];

const books = [
  { t: "Prompting Next.js for Full Stack Development", y: "2026", url: "https://www.amazon.de/-/en/dp/8169646243/" },
  { t: "3D Web Development with Three.js + Next.js", y: "", url: "https://www.amazon.de/-/en/Development-Three-js-Next-js-end-end/dp/9365895065/" },
  { t: "Next.js — scalable, production-ready apps", y: "", url: "" },
];

const projects = [
  { n: "Tofo", s: "Engine of synthetic assistants", d: "A team of synthetic experts — CTO, analyst, skeptic, growth PM — debates your idea and returns a Go/No‑Go with ranked risks and a plan.", url: "https://tofo.dev/", cta: "tofo.dev" },
  { n: "ADVNCD", s: "Amplify-like DX for Google Cloud", d: "Local-first platform for Go apps on Google Cloud: single-binary CLI, OAuth, config and Cloud Run deploys.", url: "https://advncd-docs.vercel.app/", cta: "docs" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:px-6">
        <Hero />
        <Metrics />
        <section id="talks" className="mt-16">
          <Label>spans / conference_talks</Label>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {talks.map((t) => (
              <a key={t.id} href={`https://www.youtube.com/watch?v=${t.id}`} target="_blank" rel="noreferrer" className="panel group overflow-hidden transition hover:glow">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={`https://i.ytimg.com/vi/${t.id}/hqdefault.jpg`} alt={t.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100" />
                  <span className="absolute left-2 top-2 rounded bg-background/80 px-2 py-0.5 font-mono text-[11px] text-signal">DevWorld 2026</span>
                </div>
                <div className="p-4">
                  <p className="font-mono text-[11px] uppercase text-muted-foreground">tag={t.tag}</p>
                  <h3 className="mt-1 font-medium leading-snug">{t.title}</h3>
                  <p className="mt-3 font-mono text-xs text-signal">▶ watch</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="books" className="mt-16 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div className="panel p-6">
            <Label>artifacts / books</Label>
            <h2 className="mt-3 text-3xl font-semibold">Published author · {books.length} books</h2>
            <p className="mt-3 text-muted-foreground">Next.js, 3D web and AI-assisted development — production-ready apps with Next.js, end-to-end 3D experiences with Three.js, and prompting your way through full-stack work.</p>
            <ul className="mt-4 space-y-2">
              {books.map((b) => (
                <li key={b.t} className="flex gap-2">
                  <span className="text-signal">›</span>
                  {b.url ? <a href={b.url} target="_blank" rel="noreferrer" className="hover:text-signal">{b.t}</a> : <span>{b.t}</span>}
                  <span className="font-mono text-xs leading-6 text-muted-foreground">{b.y}</span>
                </li>
              ))}
            </ul>
            <a href={books[0].url} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground transition hover:opacity-90">Latest on Amazon →</a>
          </div>
          <div className="panel p-6 font-mono text-sm">
            <Label>log stream</Label>
            <div className="mt-3 space-y-1.5 text-muted-foreground">
              <p><span className="text-trace">INFO</span> book.nextjs published</p>
              <p><span className="text-trace">INFO</span> book.threejs+nextjs published</p>
              <p><span className="text-trace">INFO</span> book.prompting-nextjs published</p>
              <p><span className="text-signal">OK&nbsp;&nbsp;</span> talk.devworld × 3 delivered</p>
              <p><span className="text-warn">WARN</span> calendar filling up for 2027</p>
              <p className="caret">tail -f andrei.log</p>
            </div>
          </div>
        </section>

        <section id="services" className="mt-16">
          <Label>services / health</Label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.k} className="panel p-5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">{s.k}</span>
                  <span className="flex items-center gap-1.5 text-signal"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal" />healthy</span>
                </div>
                <h3 className="mt-3 text-lg font-medium">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="mt-16">
          <Label>deployments / products</Label>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <a key={p.n} href={p.url} target="_blank" rel="noreferrer" className="panel p-6 transition hover:glow">
                <p className="font-mono text-xs text-signal">● running</p>
                <h3 className="mt-2 text-2xl font-semibold">{p.n}</h3>
                <p className="text-muted-foreground">{p.s}</p>
                <p className="mt-3 text-sm text-muted-foreground">{p.d}</p>
                <p className="mt-4 font-mono text-sm text-signal">→ {p.cta}</p>
              </a>
            ))}
          </div>
        </section>

        <About />
      </main>
      <footer className="border-t py-8 text-center font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} Andrei Tazetdinov · Linz, Austria · uptime 100%
      </footer>
    </div>
  );
}

function Metrics() {
  const bars = [40, 65, 50, 80, 72, 90, 60, 85, 95, 70, 88, 100];
  const items = [
    { k: "talks", v: "3", s: "DevWorld 2026" },
    { k: "books", v: String(books.length), s: "published" },
    { k: "products", v: "2", s: "in production" },
    { k: "languages", v: "EN · RU", s: "worldwide" },
  ];
  return (
    <section className="mt-12 grid gap-3 md:grid-cols-[repeat(4,1fr)_1.4fr]">
      {items.map((i) => (
        <div key={i.k} className="panel p-4">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">{i.k}</p>
          <p className="mt-1 text-3xl font-semibold">{i.v}</p>
          <p className="font-mono text-xs text-signal">{i.s}</p>
        </div>
      ))}
      <div className="panel p-4">
        <p className="font-mono text-[11px] uppercase text-muted-foreground">ai_adoption.rate</p>
        <div className="mt-2 flex h-14 items-end gap-1">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 origin-bottom rounded-sm bg-signal/70" style={{ height: `${b}%`, animation: `bar .8s ${i * 0.05}s ease-out both` }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const facts = [["location", "Linz, Austria"], ["languages", "English, Russian"], ["freelance", "available"], ["stack", "Next.js · Deno · Go · RN · Tauri"]];
  return (
    <section id="about" className="mt-16 grid gap-6 md:grid-cols-[320px_1fr]">
      <Image src={photo} alt="Andrei Tazetdinov" sizes="(min-width: 768px) 320px, 100vw" className="panel aspect-[3/4] w-full object-cover" />
      <div className="panel p-6">
        <Label>about / profile.json</Label>
        <h2 className="mt-3 text-3xl font-semibold">I am Andrei Tazetdinov</h2>
        <p className="mt-4 text-muted-foreground">A results-driven engineer with deep full stack and cross-platform experience. Today I focus on helping teams adopt AI responsibly and instrument their systems so every decision is backed by real production data. Beyond code, I teach, consult and speak — helping people and teams unlock their full potential.</p>
        <dl className="mt-6 grid gap-2 font-mono text-sm sm:grid-cols-2">
          {facts.map(([k, v]) => (
            <div key={k} className="rounded border bg-background/50 px-3 py-2"><dt className="text-xs text-muted-foreground">&quot;{k}&quot;</dt><dd className="text-signal">&quot;{v}&quot;</dd></div>
          ))}
        </dl>
        <p className="mt-6 text-lg font-medium">Let&apos;s create something exceptional together.</p>
      </div>
    </section>
  );
}
