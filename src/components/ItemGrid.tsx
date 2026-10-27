"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { kr } from "@/lib/format";
import { urlFor } from "@/sanity/image";
import type { Item, ItemStatus, RequestType } from "@/sanity/types";
import { Empty } from "./Posts";
import { RequestDialog } from "./RequestDialog";

const STATUS: Record<ItemStatus, { label: string; cls: string }> = {
  ledig: { label: "Ledig", cls: "bg-moss-soft text-moss" },
  reservert: { label: "Reservert", cls: "bg-amber-soft text-amber" },
  solgt: { label: "Solgt", cls: "bg-ink text-paper" },
};
const ORDER: Record<ItemStatus, number> = { ledig: 0, reservert: 1, solgt: 2 };

export function ItemGrid({ items, vipps }: { items: Item[]; vipps?: string }) {
  const [cat, setCat] = useState("Alle");
  const [hideSold, setHideSold] = useState(true);
  const [req, setReq] = useState<{ item: Item; type: RequestType } | null>(null);
  const [dialogKey, setDialogKey] = useState(0);

  const cats = useMemo(
    () => ["Alle", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, "nb"))],
    [items],
  );
  const shown = items
    .filter((i) => cat === "Alle" || i.category === cat)
    .filter((i) => !hideSold || i.status !== "solgt")
    .sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  const open = (item: Item, type: RequestType) => {
    setDialogKey((k) => k + 1); // fresh form state each time
    setReq({ item, type });
  };

  if (!items.length) return <Empty title="Ingen varer lagt ut ennå">Kom innom butikken, eller sjekk igjen snart.</Empty>;

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Phones: one swipeable row of chips. Larger screens: chips wrap. */}
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`btn btn-sm shrink-0 ${cat === c ? "btn-on" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-sm text-muted sm:ml-auto">
          <input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} className="accent-heart" />
          Skjul solgte
        </label>
      </div>

      {shown.length ? (
        <div className="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-5">
          {shown.map((it) => (
            <ItemCard key={it._id} item={it} onRequest={open} />
          ))}
        </div>
      ) : (
        <Empty title="Ingen varer i denne kategorien">Velg en annen kategori.</Empty>
      )}

      {req && (
        <RequestDialog key={dialogKey} open type={req.type} item={req.item} vipps={vipps} onClose={() => setReq(null)} />
      )}
    </>
  );
}

/**
 * Phones: compact row (photo left, details right).
 * From the sm breakpoint: hang-tag card with a square photo on top.
 */
function ItemCard({ item, onRequest }: { item: Item; onRequest: (i: Item, t: RequestType) => void }) {
  const st = STATUS[item.status] ?? STATUS.ledig;
  const sold = item.status === "solgt";
  const pill = (extra: string) => (
    <span className={`shrink-0 rounded-full px-2.5 py-1.5 font-mono text-[0.7rem] leading-none tracking-[0.06em] uppercase ${st.cls} ${extra}`}>
      {st.label}
    </span>
  );
  return (
    <article className="relative flex gap-3 overflow-hidden rounded-xl border border-line bg-surface p-2.5 transition-transform sm:flex-col sm:gap-0 sm:rounded-t-[14px] sm:rounded-b-[10px] sm:p-0 motion-safe:sm:hover:-translate-y-0.5">
      <span aria-hidden="true" className="absolute top-3 left-3 z-[1] hidden h-3.5 w-3.5 rounded-full border-[1.5px] border-line bg-paper sm:block" />
      {pill("absolute top-2.5 right-2.5 z-[1] hidden sm:inline-block")}
      <div
        className={`grid size-[104px] shrink-0 place-items-center overflow-hidden rounded-lg bg-paper sm:aspect-square sm:size-auto sm:w-full sm:rounded-none ${
          sold ? "opacity-60 grayscale" : ""
        }`}
      >
        {item.image ? (
          <Image
            src={urlFor(item.image).width(600).height(600).url()}
            alt={item.title}
            width={600}
            height={600}
            sizes="(min-width: 640px) 300px, 104px"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="label">Bilde kommer</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-1.5 sm:px-4 sm:pt-3.5 sm:pb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="label truncate">{[item.category, item.condition].filter(Boolean).join(" · ") || "Gjenbruk"}</span>
          {pill("sm:hidden")}
        </div>
        <h3 className="text-[1.05rem] font-bold sm:text-lg">{item.title}</h3>
        {item.description && <p className="line-clamp-2 text-sm text-muted sm:line-clamp-none sm:text-[0.93rem]">{item.description}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1.5 sm:border-t sm:border-dashed sm:border-line sm:pt-2.5">
          <span className="font-mono text-lg tabular-nums">
            <small className="mr-1 text-xs text-muted">kr</small>
            {kr(item.price)}
          </span>
          {item.status === "ledig" && (
            <div className="flex flex-wrap gap-1.5">
              {item.buyMode !== "reserver" && (
                <button type="button" className="btn btn-sm btn-primary" onClick={() => onRequest(item, "kjop")}>
                  Kjøp
                </button>
              )}
              {item.buyMode !== "kjop" && (
                <button type="button" className="btn btn-sm" onClick={() => onRequest(item, "reserver")}>
                  Reserver
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
