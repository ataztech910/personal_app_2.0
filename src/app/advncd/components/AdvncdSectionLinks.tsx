"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import advncdContent from "@/lib/content/advncd.en.json";

function getLinkClass(pathname: string, href: string) {
  return pathname === href ? "active" : undefined;
}

export default function AdvncdSectionLinks() {
  const pathname = usePathname();

  return (
    <nav className="mi-advncd-nav" aria-label="ADVNCD section navigation">
      {advncdContent.navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={getLinkClass(pathname, item.href)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
