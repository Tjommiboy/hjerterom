import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DateBadge, eventMeta } from "@/components/Posts";
import { paragraphs, todayOslo } from "@/lib/format";
import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { EVENT_QUERY } from "@/sanity/queries";
import type { Post } from "@/sanity/types";

type Props = { params: Promise<{ slug: string }> };

function getEvent(slug: string) {
  return sanityFetch<Post | null>({ query: EVENT_QUERY, params: { slug: decodeURIComponent(slug) }, tags: ["post"] });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return { title: "Fant ikke arrangementet" };
  return {
    title: event.title,
    description: event.body?.slice(0, 160),
    openGraph: event.image ? { images: [urlFor(event.image).width(1200).height(630).url()] } : undefined,
  };
}

export default async function EventPage({ params }: Props) {
  const event = await getEvent((await params).slug);
  if (!event || !event.eventDate) notFound();

  const isPast = event.eventDate < todayOslo();

  return (
    <article className="mx-auto grid max-w-3xl gap-6">
      <Link href="/" className="text-[0.95rem] font-bold text-muted hover:text-ink">
        ← Alle events
      </Link>

      <header className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5">
        <DateBadge date={event.eventDate} large />
        <div className="min-w-0">
          <h1 className="text-[clamp(1.9rem,5vw,3rem)] font-extrabold tracking-[-0.03em]">{event.title}</h1>
          <p className="mt-2 font-mono text-[0.92rem] text-muted">{eventMeta(event)}</p>
          {isPast && (
            <p className="mt-3 inline-block rounded-full bg-amber-soft px-3 py-1 text-[0.85rem] font-bold text-amber">
              Dette arrangementet er over
            </p>
          )}
        </div>
      </header>

      {event.image && (
        <Image
          src={urlFor(event.image).width(1400).height(788).url()}
          alt=""
          width={1400}
          height={788}
          priority
          className="aspect-video w-full rounded-[10px] object-cover"
        />
      )}

      {event.body && (
        <div className="grid gap-3.5 text-[1.06rem]">
          {paragraphs(event.body).map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <Link href="/kontakt" className="btn btn-primary">
          Spørsmål? Kontakt oss
        </Link>
        <Link href="/" className="btn">
          Se flere events
        </Link>
      </div>
    </article>
  );
}
