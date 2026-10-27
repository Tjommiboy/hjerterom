"use server";

import { writeClient } from "@/sanity/writeClient";
import type { RequestType } from "@/sanity/types";

export type RequestState = { status: "idle" | "ok" | "error"; message?: string };

const TYPES: RequestType[] = ["kjop", "reserver", "melding"];

async function verifyTurnstile(token: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile not configured yet
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

export async function sendRequest(_prev: RequestState, form: FormData): Promise<RequestState> {
  // Honeypot: real people never fill in this hidden field
  if (String(form.get("website") ?? "")) return { status: "ok" };

  const type = String(form.get("type") ?? "") as RequestType;
  const itemId = String(form.get("itemId") ?? "") || null;
  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  const phone = String(form.get("phone") ?? "").trim().slice(0, 40);
  const note = String(form.get("note") ?? "").trim().slice(0, 2000);

  if (!TYPES.includes(type)) return { status: "error", message: "Noe gikk galt. Last inn siden og prøv igjen." };
  if (!name) return { status: "error", message: "Skriv navnet ditt." };
  if (!/^[+\d][\d\s-]{6,}$/.test(phone)) return { status: "error", message: "Skriv et telefonnummer vi kan nå deg på." };
  if (type === "melding" && !note) return { status: "error", message: "Skriv meldingen din." };
  if (!(await verifyTurnstile(form.get("cf-turnstile-response") as string | null))) {
    return { status: "error", message: "Vi kunne ikke bekrefte at du ikke er en robot. Prøv igjen." };
  }

  try {
    await writeClient.create({
      // IDs under a "requests." path are hidden from unauthenticated reads of the public dataset
      _id: `requests.${crypto.randomUUID()}`,
      _type: "request",
      type,
      ...(itemId ? { item: { _type: "reference", _ref: itemId, _weak: true } } : {}),
      name,
      phone,
      note,
      handled: false,
      createdAt: new Date().toISOString(),
    });
    // TODO: send an email to the shop here, e.g. with Resend
    return { status: "ok" };
  } catch {
    return { status: "error", message: "Vi fikk ikke sendt forespørselen. Ring eller send e-post til butikken i stedet." };
  }
}
