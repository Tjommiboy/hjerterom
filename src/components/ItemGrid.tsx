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
      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        {cats.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`btn btn-sm ${cat === c ? "btn-on" : ""}`}>
            {c}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-1.5 text-sm text-muted">
          <input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} className="accent-heart" />
          Skjul solgte
        </label>
      </div>

      {shown.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-5">
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

function ItemCard({ item, onRequest }: { item: Item; onRequest: (i: Item, t: RequestType) => void }) {
  const st = STATUS[item.status] ?? STATUS.ledig;
  const sold = item.status === "solgt";
  return (
    <article className="relative flex flex-col overflow-hidden rounded-t-[14px] rounded-b-[10px] border border-line bg-surface transition-transform motion-safe:hover:-translate-y-0.5">
      <span aria-hidden="true" className="absolute top-3 left-3 z-[1] h-3.5 w-3.5 rounded-full border-[1.5px] border-line bg-paper" />
      <span className={`absolute top-2.5 right-2.5 z-[1] rounded-full px-2.5 py-1.5 font-mono text-[0.7rem] tracking-[0.06em] uppercase ${st.cls}`}>
        {st.label}
      </span>
      <div className={`grid aspect-square place-items-center bg-paper ${sold ? "opacity-60 grayscale" : ""}`}>
        {item.image ? (
          <Image
            src={urlFor(item.image).width(600).height(600).url()}
            alt={item.title}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="label">Bilde kommer</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3.5 pb-4">
        <div className="label">{[item.category, item.condition].filter(Boolean).join(" · ") || "Gjenbruk"}</div>
        <h3 className="text-lg font-bold">{item.title}</h3>
        {item.description && <p className="text-[0.93rem] text-muted">{item.description}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-line pt-2.5">
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
