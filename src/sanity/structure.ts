import type { StructureResolver } from "sanity/structure";

/** Studio sidebar: Butikkinfo as a single document, open requests on top. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Hjerterom")
    .items([
      S.listItem()
        .title("Åpne forespørsler")
        .child(
          S.documentList()
            .title("Åpne forespørsler")
            .filter('_type == "request" && handled != true')
            .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Alle forespørsler")
        .child(S.documentTypeList("request").defaultOrdering([{ field: "createdAt", direction: "desc" }])),
      S.divider(),
      S.documentTypeListItem("post").title("Nyheter og arrangementer"),
      S.documentTypeListItem("item").title("Varer"),
      S.divider(),
      S.listItem()
        .title("Butikkinfo")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
