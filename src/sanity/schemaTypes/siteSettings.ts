import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Butikkinfo",
  type: "document",
  fields: [
    defineField({
      name: "tagline",
      title: "Overskrift på forsiden",
      type: "string",
      description: "Tomt felt gir «Gjenbruk med hjerterom.»",
    }),
    defineField({ name: "lede", title: "Ingress på forsiden", type: "text", rows: 3 }),
    defineField({
      name: "hours",
      title: "Åpningstider",
      type: "text",
      rows: 6,
      description: "Én linje per dag, f.eks. «Tir–fre  11–18».",
    }),
    defineField({ name: "about", title: "Om oss", type: "text", rows: 10, description: "Tom linje mellom avsnitt." }),
    defineField({ name: "address", title: "Adresse", type: "string" }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "email", title: "E-post", type: "string" }),
    defineField({ name: "vipps", title: "Vipps-nummer", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Butikkinfo" }) },
});
