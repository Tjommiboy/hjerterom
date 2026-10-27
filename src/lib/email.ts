import "server-only";

type Notice = {
  type: "kjop" | "reserver" | "melding";
  name: string;
  phone: string;
  email?: string;
  note?: string;
  itemTitle?: string | null;
  itemPrice?: number | null;
  requestId: string;
};

const TYPE_LABEL = { kjop: "Kjøp", reserver: "Reservasjon", melding: "Melding" } as const;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Emails the shop about a new request through Resend's HTTP API.
 * Returns false (and logs) instead of throwing: the request is already saved in Sanity.
 */
export async function notifyShop(n: Notice): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Hjerterom nettside <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.warn("Email not sent: RESEND_API_KEY or CONTACT_TO_EMAIL is missing.");
    return false;
  }

  const label = TYPE_LABEL[n.type];
  const subject = n.itemTitle ? `${label}: ${n.itemTitle} – ${n.name}` : `${label} fra ${n.name}`;
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const studioLink = site ? `${site}/studio/intent/edit/id=${n.requestId};type=request` : null;

  const rows: [string, string][] = [
    ["Type", label],
    ...(n.itemTitle ? ([["Vare", n.itemPrice != null ? `${n.itemTitle} (kr ${n.itemPrice})` : n.itemTitle]] as [string, string][]) : []),
    ["Navn", n.name],
    ["Telefon", n.phone],
    ...(n.email ? ([["E-post", n.email]] as [string, string][]) : []),
  ];

  const text = [
    `Ny ${label.toLowerCase()} fra nettsiden.`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    ...(n.note ? ["", "Melding:", n.note] : []),
    ...(studioLink ? ["", `Åpne i Studio: ${studioLink}`] : []),
  ].join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1b2321">
  <p style="margin:0 0 12px">Ny <strong>${esc(label.toLowerCase())}</strong> fra nettsiden.</p>
  <table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#566360">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
  ${n.note ? `<p style="margin:16px 0 4px;color:#566360">Melding</p><p style="margin:0;white-space:pre-line">${esc(n.note)}</p>` : ""}
  ${studioLink ? `<p style="margin:20px 0 0"><a href="${esc(studioLink)}" style="color:#af2347">Åpne forespørselen i Studio</a></p>` : ""}
</div>`;

  const body = JSON.stringify({
    from,
    to: to.split(",").map((s) => s.trim()),
    subject,
    text,
    html,
    ...(n.email ? { reply_to: n.email } : {}),
  });

  // Up to 3 attempts. Retry only on network errors, 429 and 5xx (Resend's guidance);
  // the idempotency key stops a retry from sending the same email twice.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `request-${n.requestId}`,
        },
        body,
      });
      if (res.ok) {
        const { id } = (await res.json()) as { id?: string };
        console.info("Email sent", id);
        return true;
      }
      const retryable = res.status === 429 || res.status >= 500;
      console.error("Resend error", res.status, await res.text());
      if (!retryable || attempt === 3) return false;
      const wait = Number(res.headers.get("retry-after")) * 1000 || 500 * 2 ** attempt;
      await new Promise((r) => setTimeout(r, Math.min(wait, 5000)));
    } catch (err) {
      console.error("Resend request failed", err);
      if (attempt === 3) return false;
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    }
  }
  return false;
}
