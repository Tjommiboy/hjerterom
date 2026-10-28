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

/** Hjerterom mark: a heart with a four-pane window in the upper right ("hjerte-rom"). Panes are see-through. */
export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path fillRule="evenodd" fill="var(--color-heart)" d="M32 56C14 44 4 33 4 21C4 11.5 11 5 19.5 5C25.5 5 29.8 8.4 32 13C34.2 8.4 38.5 5 44.5 5C53 5 60 11.5 60 21C60 33 50 44 32 56ZM37 13h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1ZM46 13h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1ZM37 22h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1ZM46 22h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1Z" />
    </svg>
  );
}

export function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight" aria-label="Hjerterom, forside">
          <Heart className="h-[28px] w-[28px]" />
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
