import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Andrei Tazetdinov",
  description: "Notes on AI adoption, observability and modern frontend by Andrei Tazetdinov.",
  openGraph: {
    title: "Blog — Andrei Tazetdinov",
    description: "Notes on AI adoption, observability and modern frontend.",
    type: "website",
  },
  twitter: { card: "summary" },
};

export default function BlogPage() {
  const posts = [...blogPosts].reverse();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <p className="font-mono text-xs text-signal">$ ls ./posts</p>
      <h1 className="mt-2 text-4xl font-semibold">Blog</h1>
      <p className="mt-2 text-muted-foreground">Notes on AI adoption, observability and the modern frontend.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {posts.map((p, i) => (
          <a key={p.id} href={p.filesource} target="_blank" rel="noreferrer" className="panel group overflow-hidden transition hover:glow">
            <div className="relative aspect-video overflow-hidden">
              <Image src={p.featuredImage} alt={p.title} fill loading={i < 2 ? "eager" : "lazy"} sizes="(min-width: 640px) 50vw, 100vw" className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <p className="font-mono text-[11px] uppercase text-muted-foreground">{p.createDay} {p.createMonth} {p.createYear} · medium</p>
              <h2 className="mt-1 font-medium leading-snug">{p.title}</h2>
              <p className="mt-3 font-mono text-xs text-signal">→ read</p>
            </div>
          </a>
        ))}
      </div>
      <div className="panel mt-8 p-10 text-center">
        <p className="font-mono text-sm text-muted-foreground">{posts.length} posts · next article is on its way</p>
        <p className="mt-3">Want new articles in your inbox?</p>
        <Link href="/contact?tab=email" className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground hover:opacity-90">Subscribe →</Link>
      </div>
    </main>
  );
}
