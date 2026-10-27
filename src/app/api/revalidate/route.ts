import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook target. In sanity.io/manage → API → Webhooks, point a webhook at
 * https://<your-domain>/api/revalidate with projection {_type} and the secret
 * from SANITY_REVALIDATE_SECRET. Publishing in Studio then updates the site at once.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );
    if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    if (!body?._type) return NextResponse.json({ message: "Missing _type" }, { status: 400 });
    revalidateTag(body._type);
    return NextResponse.json({ revalidated: body._type });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
