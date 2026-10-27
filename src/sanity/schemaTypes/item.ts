import { defineField, defineType } from "sanity";

export const CATEGORIES = ["Møbler", "Klær", "Kjøkken", "Bøker", "Fritid", "Barn", "Interiør", "Annet"];

export const item = defineType({
  name: "item",
  title: "Varer",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Navn på varen", type: "string", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Bilde", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", title: "Beskrivelse", type: "text", rows: 3 }),
    defineField({
      name: "price",
      title: "Pris (kr)",
      type: "number",
      validation: (r) => r.required().min(0).integer(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: { list: CATEGORIES },
    }),
    defineField({
      name: "condition",
      title: "Tilstand",
      type: "string",
      options: { list: ["Som ny", "Pent brukt", "Brukt", "Trenger kjærlighet"] },
      initialValue: "Pent brukt",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Ledig", value: "ledig" },
          { title: "Reservert", value: "reservert" },
          { title: "Solgt", value: "solgt" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "ledig",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "buyMode",
      title: "Hvordan kan kunder få den?",
      type: "string",
      options: {
        list: [
          { title: "Kjøp og reserver", value: "begge" },
          { title: "Bare kjøp", value: "kjop" },
          { title: "Bare reserver", value: "reserver" },
        ],
        layout: "radio",
      },
      initialValue: "begge",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Lagt ut",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { title: "title", price: "price", status: "status", media: "image" },
    prepare: ({ title, price, status, media }) => ({
      title,
      subtitle: `kr ${price ?? "–"} · ${status ?? ""}`,
      media,
    }),
  },
});
