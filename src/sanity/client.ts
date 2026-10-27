import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
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
  return client.fetch<T>(query, params, { next: { revalidate: 60, tags } });
}
