import type { Metadata } from "next";
import Link from "next/link";
import "./(site)/site.css";

export const metadata: Metadata = {
  title: "404 — Andrei Tazetdinov",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <p className="font-mono text-xs text-signal">$ curl -I {"<this page>"}</p>
            <h1 className="mt-3 text-7xl font-semibold">404</h1>
            <p className="mt-2 text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link href="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground hover:opacity-90">Go home</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
