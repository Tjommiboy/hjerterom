"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";
const ORDER: Theme[] = ["system", "light", "dark"];
const LABEL: Record<Theme, string> = { system: "Systemets innstilling", light: "Lys modus", dark: "Mørk modus" };

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    if (theme === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  } catch {
    /* storage blocked: the choice lasts for this visit only */
  }
}

/** Cycles System → Lys → Mørk. The choice is remembered in this browser. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    setTheme(t === "light" || t === "dark" ? t : "system");
  }, []);

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={() => {
        apply(next);
        setTheme(next);
      }}
      aria-label={`Tema: ${LABEL[theme]}. Bytt til ${LABEL[next].toLowerCase()}`}
      title={`Tema: ${LABEL[theme]}`}
      className="grid size-9 place-items-center rounded-full text-muted hover:bg-paper hover:text-ink"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {theme === "light" && (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </>
        )}
        {theme === "dark" && <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />}
        {theme === "system" && (
          <>
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M8 20h8M12 16v4" />
          </>
        )}
      </svg>
    </button>
  );
}
