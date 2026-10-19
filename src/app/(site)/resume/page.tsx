import type { Metadata } from "next";
import { ResumeDownload } from "@/components/site/ResumeDownload";
import { resume } from "@/lib/resume-data";

export const metadata: Metadata = {
  title: "Resume — Andrei Tazetdinov",
  description: "Resume of Andrei Tazetdinov: AI adoption, observability, conference talks and books. Download as PDF.",
  openGraph: {
    title: "Resume — Andrei Tazetdinov",
    description: "AI adoption & observability consultant, speaker and author. Download the CV.",
    type: "profile",
  },
  twitter: { card: "summary" },
};

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-signal">$ cat resume.json</p>
          <h1 className="mt-2 text-4xl font-semibold">{resume.name}</h1>
          <p className="mt-1 text-muted-foreground">{resume.title}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{resume.location} · {resume.languages}</p>
        </div>
        <ResumeDownload />
      </div>
      <Block title="summary"><p className="text-muted-foreground">{resume.summary}</p></Block>
      <Block title="focus">
        <div className="grid gap-3 sm:grid-cols-2">
          {resume.focus.map((f) => (
            <div key={f.t} className="rounded border bg-background/50 p-3"><p className="font-medium">{f.t}</p><p className="text-sm text-muted-foreground">{f.d}</p></div>
          ))}
        </div>
      </Block>
      <Block title="talks"><List items={resume.talks} /></Block>
      <Block title="books"><List items={resume.books} /></Block>
      <Block title="products"><List items={resume.projects} /></Block>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel mt-6 p-6">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{"// "}{title}</p>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return <ul className="space-y-2">{items.map((i) => <li key={i} className="flex gap-2"><span className="text-signal">›</span>{i}</li>)}</ul>;
}
