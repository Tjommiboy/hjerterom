export const apiVersion = "2025-08-01";

// Project ID and dataset are public (every visitor's browser sees them), so safe defaults
// keep builds working even if the env vars are missing. Env vars still win when set.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uh0hyth1";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
