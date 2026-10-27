export const apiVersion = "2025-08-01";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  console.warn("Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env.local and fill it in.");
}
