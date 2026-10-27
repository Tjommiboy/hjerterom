import type { Metadata } from "next";
import { ContactPanel } from "@/components/ContactPanel";
import { sanityFetch } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";

export const metadata: Metadata = { title: "Kontakt" };

export default async function ContactPage() {
  const settings = await sanityFetch<SiteSettings | null>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
  return (
    <section className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_20rem]">
      <ContactPanel settings={settings} />
      <aside className="grid gap-2 rounded-[10px] border border-line bg-surface p-5">
        <div className="label">Åpningstider</div>
        <pre className="font-mono text-[0.92rem] leading-7 whitespace-pre-wrap">{settings?.hours || "Legges ut snart"}</pre>
      </aside>
    </section>
  );
}
