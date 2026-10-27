import Image from "next/image";
import { dateParts, longDate, shortStamp } from "@/lib/format";
import { urlFor } from "@/sanity/image";
import type { Post } from "@/sanity/types";

export function EventCard({ post }: { post: Post }) {
  const { day, month } = dateParts(post.eventDate!);
  const meta = [longDate(post.eventDate!), post.eventTime && `kl. ${post.eventTime}`, post.place].filter(Boolean).join(" · ");
  return (
    <article className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-[10px] border border-line bg-surface p-4">
      <div aria-hidden="true" className="w-16 self-start rounded-lg bg-heart pt-2 pb-2.5 text-center text-on-heart">
        <span className="block font-display text-3xl leading-none font-extrabold tabular-nums">{day}</span>
        <span className="mt-1 block font-mono text-[0.7rem] tracking-[0.1em] uppercase">{month}</span>
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-bold">{post.title}</h3>
        <p className="mt-1 font-mono text-[0.82rem] text-muted">{meta}</p>
        {post.body && <p className="mt-2 whitespace-pre-line">{post.body}</p>}
        {post.image && (
          <Image
            src={urlFor(post.image).width(800).height(450).url()}
            alt=""
            width={800}
            height={450}
            className="mt-3 aspect-video w-full rounded-lg object-cover"
          />
        )}
      </div>
    </article>
  );
}

export function NewsItem({ post }: { post: Post }) {
  return (
    <article className="grid gap-5 border-b border-line py-6 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="max-w-2xl min-w-0">
        <div className="label">{shortStamp(post.publishedAt)}</div>
        <h3 className="mt-1.5 text-xl font-bold">{post.title}</h3>
        {post.body && <p className="mt-2 whitespace-pre-line">{post.body}</p>}
      </div>
      {post.image && (
        <Image
          src={urlFor(post.image).width(480).height(360).url()}
          alt=""
          width={240}
          height={180}
          className="aspect-[4/3] w-full rounded-lg object-cover sm:w-44"
        />
      )}
    </article>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border-[1.5px] border-dashed border-line p-7 text-center text-muted">
      <strong className="mb-1 block font-display text-lg text-ink">{title}</strong>
      {children}
    </div>
  );
}
