"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "hjerterom",
  title: "Hjerterom",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Butikkinfo is a single document: hide it from "create new"
    templates: (templates) => [
      ...templates.filter((t) => t.schemaType !== "siteSettings" && t.schemaType !== "post"),
      { id: "post-arrangement", title: "Arrangement (Events)", schemaType: "post", value: () => ({ kind: "arrangement", place: "I butikken", publishedAt: new Date().toISOString() }) },
      { id: "post-nyhet", title: "Nyhet (Nytt fra butikken)", schemaType: "post", value: () => ({ kind: "nyhet", publishedAt: new Date().toISOString() }) },
    ],
  },
  document: {
    // Requests come from the website only
    newDocumentOptions: (prev) => prev.filter((o) => o.templateId !== "request"),
    actions: (prev, { schemaType }) =>
      schemaType === "siteSettings" ? prev.filter((a) => !["duplicate", "delete", "unpublish"].includes(a.action ?? "")) : prev,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
