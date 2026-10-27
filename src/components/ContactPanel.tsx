"use client";

import { useState } from "react";
import { mapsLink } from "@/lib/site";
import type { SiteSettings } from "@/sanity/types";
import { Empty } from "./Posts";
import { RequestDialog } from "./RequestDialog";

export function ContactPanel({ settings }: { settings: SiteSettings | null }) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);
  const s = settings ?? {};
  const rows: [string, string, string?][] = [
    ["Adresse", s.address ?? "", s.address ? mapsLink(s.address) : undefined],
    ["Telefon", s.phone ?? "", s.phone ? `tel:${s.phone.replace(/\s/g, "")}` : undefined],
    ["E-post", s.email ?? "", s.email ? `mailto:${s.email}` : undefined],
    ["Vipps", s.vipps ?? ""],
  ].filter((r) => r[1]) as [string, string, string?][];

  return (
    <div>
      <h1 className="mb-5 text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.03em]">Kontakt</h1>
      {rows.length ? (
        <dl className="max-w-2xl border-t border-line">
          {rows.map(([k, v, href]) => (
            <div key={k} className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-3 border-b border-line py-3.5">
              <dt className="label">{k}</dt>
              <dd className="text-[1.08rem] break-words">{href ? (
                  <a href={href} className="underline-offset-4 hover:underline" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {v}
                  </a>
                ) : (
                  v
                )}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <Empty title="Kontaktinfo kommer">Telefon, e-post og adresse legges ut her.</Empty>
      )}
      <button
        type="button"
        className="btn btn-primary mt-7"
        onClick={() => {
          setKey((k) => k + 1);
          setOpen(true);
        }}
      >
        Send oss en melding
      </button>
      {open && <RequestDialog key={key} open type="melding" onClose={() => setOpen(false)} />}
    </div>
  );
}
