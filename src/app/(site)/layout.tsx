import { Header } from "@/components/Header";
import { SHOP_DEFAULTS } from "@/lib/site";
import { sanityFetch } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/sanity/queries";
import type { SiteSettings } from "@/sanity/types";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch<SiteSettings | null>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
  return (
    <>
      <Header />
      <main className="mx-auto grid max-w-6xl gap-12 px-4 pt-8 pb-20">{children}</main>
      <footer className="border-t border-line py-6 text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4">
          <span>Hjerterom · gjenbruk og fellesskap</span>
          <span>{settings?.address || SHOP_DEFAULTS.address}</span>
        </div>
      </footer>
    </>
  );
}
