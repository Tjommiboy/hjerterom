import type { Metadata } from "next";
import { ContactPanel } from "@/components/ContactPanel";
import { mapsEmbed, mapsLink, withDefaults } from "@/lib/site";
import { sanityFetch } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";

export const metadata: Metadata = { title: "Kontakt" };

export default async function ContactPage() {
  const settings = withDefaults(await sanityFetch<SiteSettings | null>({ query: SETTINGS_QUERY, tags: ["siteSettings"] }));
  const address = settings.address!;
  return (
    <>
      <section className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_20rem]">
        <ContactPanel settings={settings} />
        <aside className="grid gap-2 rounded-[10px] border border-line bg-surface p-5">
          <div className="label">Åpningstider</div>
          <pre className="font-mono text-[0.92rem] leading-7 whitespace-pre-wrap">{settings.hours || "Legges ut snart"}</pre>
        </aside>
      </section>

      <section aria-labelledby="finn-oss">
        <h2 id="finn-oss" className="mb-2 text-[clamp(1.5rem,3vw,2rem)] font-bold">
          Finn oss
        </h2>
        <p className="mb-5 text-muted">
          Du finner oss i <span className="text-ink">{address}</span>.{" "}
          <a href={mapsLink(address)} target="_blank" rel="noopener noreferrer" className="font-bold text-heart underline-offset-4 hover:underline">
            Få veibeskrivelse
          </a>
        </p>
        <div className="overflow-hidden rounded-[10px] border border-line bg-surface">
          <iframe
            title={`Kart: ${address}`}
            src={mapsEmbed(address)}
            className="block aspect-[4/3] w-full sm:aspect-[21/9]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
