import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache: every page asks Sanity's CDN for fresh content,
// which is fast and well within Sanity's free quota for a small shop.
export default defineCloudflareConfig({});
