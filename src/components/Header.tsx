"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Nytt" },
  { href: "/varer", label: "Varer" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 26" aria-hidden="true" className={className}>
      <path d="M13 22.5 4.2 13.9A5.3 5.3 0 0 1 13 7.2a5.3 5.3 0 0 1 8.8 6.7Z" fill="var(--color-heart)" />
      <rect x="9.5" y="12" width="7" height="6" rx="1" fill="var(--color-surface)" />
    </svg>
  );
}

export function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight" aria-label="Hjerterom, forside">
          <Heart className="h-[26px] w-[26px]" />
          Hjerterom
        </Link>
        <nav className="ml-auto flex flex-wrap gap-1">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-[0.95rem] font-bold ${
                  active ? "bg-heart-soft text-ink" : "text-muted hover:bg-paper hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
