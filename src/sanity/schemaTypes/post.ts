import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Nyheter og arrangementer",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Nyhet", value: "nyhet" },
          { title: "Arrangement", value: "arrangement" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "nyhet",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Tittel", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Lenke (URL)",
      type: "slug",
      description: "Adressen til arrangementet, f.eks. /events/byttedag-i-mars. Trykk «Generate» etter at du har skrevet tittelen.",
      options: {
        source: "title",
        maxLength: 80,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/æ/g, "ae")
            .replace(/ø/g, "o")
            .replace(/å/g, "a")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      hidden: ({ parent }) => parent?.kind !== "arrangement",
    }),
    defineField({ name: "body", title: "Tekst", type: "text", rows: 6 }),
    defineField({
      name: "eventDate",
      title: "Dato",
      type: "date",
      hidden: ({ parent }) => parent?.kind !== "arrangement",
      validation: (r) =>
        r.custom((v, ctx) =>
          (ctx.parent as { kind?: string })?.kind === "arrangement" && !v ? "Arrangementer trenger en dato" : true,
        ),
    }),
    defineField({
      name: "eventTime",
      title: "Klokkeslett",
      type: "string",
      description: "F.eks. 12:00",
      hidden: ({ parent }) => parent?.kind !== "arrangement",
    }),
    defineField({
      name: "place",
      title: "Sted",
      type: "string",
      initialValue: "I butikken",
      hidden: ({ parent }) => parent?.kind !== "arrangement",
    }),
    defineField({ name: "image", title: "Bilde", type: "image", options: { hotspot: true } }),
    defineField({
      name: "publishedAt",
      title: "Publisert",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [{ title: "Nyeste først", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", kind: "kind", date: "eventDate", media: "image" },
    prepare: ({ title, kind, date, media }) => ({
      title,
      subtitle: kind === "arrangement" ? `Arrangement · ${date ?? "uten dato"}` : "Nyhet",
      media,
    }),
  },
});
