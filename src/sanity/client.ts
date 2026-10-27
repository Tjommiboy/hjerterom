import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

/**
 * Fetch from Sanity with Next.js caching. Pages refresh every 60 s, and
 * immediately when the Sanity webhook hits /api/revalidate with a matching tag.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T> {
  // In development, always fetch fresh content so Studio edits show on the next refresh.
  const revalidate = process.env.NODE_ENV === "development" ? 0 : 60;
  return client.fetch<T>(query, params, { next: { revalidate, tags } });
}
