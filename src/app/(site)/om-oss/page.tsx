import type { Metadata } from "next";
import Link from "next/link";
import { paragraphs } from "@/lib/format";
import { sanityFetch } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";

export const metadata: Metadata = { title: "Om oss" };

const FALLBACK =
  "Hjerterom er en bruktbutikk og et fellesskap. Målet er å redusere forbruket og bidra til et bedre miljø.";

export default async function AboutPage() {
  const settings = await sanityFetch<SiteSettings | null>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
  return (
    <section className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <h1 className="mb-5 text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.03em]">Om oss</h1>
        <div className="grid max-w-2xl gap-3.5 text-[1.06rem]">
          {paragraphs(settings?.about || FALLBACK).map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </div>
      <aside className="grid gap-3.5 rounded-[10px] border border-line bg-surface p-5">
        <div className="label">Slik fungerer det</div>
        <p>Lever inn ting du ikke bruker i åpningstiden. Vi sorterer, priser og setter det ut i butikken.</p>
        <p>Overskuddet går tilbake til driften og arrangementene våre.</p>
        <Link href="/kontakt" className="btn justify-self-start">
          Kontakt oss
        </Link>
      </aside>
    </section>
  );
}
