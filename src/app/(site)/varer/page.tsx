import type { Metadata } from "next";
import { ItemGrid } from "@/components/ItemGrid";
import { sanityFetch } from "@/sanity/client";
import { ITEMS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";
import type { Item, SiteSettings } from "@/sanity/types";

export const metadata: Metadata = { title: "Varer" };

export default async function ItemsPage() {
  const [items, settings] = await Promise.all([
    sanityFetch<Item[]>({ query: ITEMS_QUERY, tags: ["item"] }),
    sanityFetch<SiteSettings | null>({ query: SETTINGS_QUERY, tags: ["siteSettings"] }),
  ]);
  return (
    <section>
      <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.03em]">Varer</h1>
      <p className="mt-2 mb-6 max-w-xl text-muted">
        Et utvalg fra hyllene. Kjøp direkte og hent i butikken, eller reserver og se på varen først.
      </p>
      <ItemGrid items={items} vipps={settings?.vipps} />
    </section>
  );
}
