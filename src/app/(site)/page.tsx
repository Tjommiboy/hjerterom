import { Empty, EventCard, NewsItem } from "@/components/Posts";
import { todayOslo } from "@/lib/format";
import { sanityFetch } from "@/sanity/client";
import { NEWS_QUERY, SETTINGS_QUERY, UPCOMING_EVENTS_QUERY } from "@/sanity/queries";
import type { Post, SiteSettings } from "@/sanity/types";

export default async function HomePage() {
  const [settings, events, news] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: SETTINGS_QUERY, tags: ["siteSettings"] }),
    sanityFetch<Post[]>({ query: UPCOMING_EVENTS_QUERY, params: { today: todayOslo() }, tags: ["post"] }),
    sanityFetch<Post[]>({ query: NEWS_QUERY, tags: ["post"] }),
  ]);

  return (
    <>
      <section className="grid items-end gap-7 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <h1 className="text-[clamp(2.2rem,6vw,4rem)] font-extrabold tracking-[-0.035em]">
            {settings?.tagline || (
              <>
                Gjenbruk med <em className="text-heart not-italic">hjerterom</em>.
              </>
            )}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            {settings?.lede ||
              "En bruktbutikk og et møtested. Vi gir ting et nytt liv, så vi kjøper mindre nytt og tar bedre vare på det vi har."}
          </p>
        </div>
        <div className="rounded-[10px] border border-line bg-surface px-5 py-4">
          <div className="label">Åpningstider</div>
          <pre className="mt-2 font-mono text-[0.92rem] leading-7 whitespace-pre-wrap">{settings?.hours || "Legges ut snart"}</pre>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-[clamp(1.5rem,3vw,2rem)] font-bold">Events</h2>
        {events.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4">
            {events.map((p) => (
              <EventCard key={p._id} post={p} />
            ))}
          </div>
        ) : (
          <Empty title="Ingen arrangementer akkurat nå">Følg med her for byttedager, verksteder og salg.</Empty>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-[clamp(1.5rem,3vw,2rem)] font-bold">Nytt fra butikken</h2>
        {news.length ? (
          <div className="border-t border-line">
            {news.map((p) => (
              <NewsItem key={p._id} post={p} />
            ))}
          </div>
        ) : (
          <Empty title="Ingen nyheter ennå">Nyheter fra butikken dukker opp her.</Empty>
        )}
      </section>
    </>
  );
}
