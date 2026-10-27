import { defineField, defineType } from "sanity";

/** Purchase requests, reservations and messages sent from the website. */
export const request = defineType({
  name: "request",
  title: "Forespørsler",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Kjøp", value: "kjop" },
          { title: "Reservasjon", value: "reserver" },
          { title: "Melding", value: "melding" },
        ],
      },
      readOnly: true,
    }),
    defineField({ name: "item", title: "Vare", type: "reference", to: [{ type: "item" }], weak: true, readOnly: true }),
    defineField({ name: "name", title: "Navn", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Telefon", type: "string", readOnly: true }),
    defineField({ name: "note", title: "Melding", type: "text", rows: 4, readOnly: true }),
    defineField({ name: "createdAt", title: "Sendt", type: "datetime", readOnly: true }),
    defineField({
      name: "handled",
      title: "Behandlet",
      type: "boolean",
      initialValue: false,
      description: "Huk av når kunden er kontaktet. Slett forespørselen når den ikke trengs lenger.",
    }),
  ],
  preview: {
    select: { name: "name", type: "type", item: "item.title", handled: "handled" },
    prepare: ({ name, type, item, handled }) => {
      const label = type === "kjop" ? "Kjøp" : type === "reserver" ? "Reservasjon" : "Melding";
      return { title: `${handled ? "✓ " : ""}${name ?? "Uten navn"}`, subtitle: `${label}${item ? ` · ${item}` : ""}` };
    },
  },
});
