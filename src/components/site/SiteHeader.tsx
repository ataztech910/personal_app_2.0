"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { to: "/", label: "home" },
  { to: "/resume", label: "resume" },
  { to: "/blog", label: "blog" },
  { to: "/contact", label: "contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 font-mono text-sm md:px-6">
        <Link href="/" className="flex items-center gap-2"><span className="pulse-dot h-2 w-2 rounded-full bg-signal" />andrei<span className="hidden text-muted-foreground sm:inline">.tazetdinov</span></Link>
        <nav className="flex gap-4 text-muted-foreground md:gap-6">
          {nav.map((n) => (
            <Link key={n.to} href={n.to} className={pathname === n.to ? "text-signal" : "hover:text-foreground"}>{n.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
