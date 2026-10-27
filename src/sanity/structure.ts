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
      S.listItem()
        .title("Events (arrangementer)")
        .child(
          S.documentList()
            .title("Events (arrangementer)")
            .schemaType("post")
            .filter('_type == "post" && kind == "arrangement"')
            .defaultOrdering([{ field: "eventDate", direction: "desc" }])
            .initialValueTemplates([S.initialValueTemplateItem("post-arrangement")]),
        ),
      S.listItem()
        .title("Nytt fra butikken (nyheter)")
        .child(
          S.documentList()
            .title("Nytt fra butikken (nyheter)")
            .schemaType("post")
            .filter('_type == "post" && kind != "arrangement"')
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
            .initialValueTemplates([S.initialValueTemplateItem("post-nyhet")]),
        ),
      S.documentTypeListItem("item").title("Varer"),
      S.divider(),
      S.listItem()
        .title("Butikkinfo")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
