"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef } from "react";
import { sendRequest, type RequestState } from "@/app/(site)/actions";
import { kr } from "@/lib/format";
import type { Item, RequestType } from "@/sanity/types";

const TITLES: Record<RequestType, string> = { kjop: "Kjøp", reserver: "Reserver", melding: "Send oss en melding" };
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Props = {
  open: boolean;
  type: RequestType;
  item?: Item | null;
  vipps?: string;
  onClose: () => void;
};

export function RequestDialog({ open, type, item, vipps, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState<RequestState, FormData>(sendRequest, { status: "idle" });

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const title = item ? `${TITLES[type]}: ${item.title}` : TITLES[type];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-2xl bg-surface p-0 text-ink backdrop:bg-black/50 sm:m-auto sm:max-h-[90dvh] sm:w-[min(100%-2rem,34rem)] sm:rounded-2xl"
    >
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <div className="grid gap-4 px-4 pt-2.5 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:p-6">
        {/* Grab handle: phones show the dialog as a bottom sheet */}
        <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line sm:hidden" />
        <h2 className="text-2xl font-bold">{title}</h2>
        {item && (
          <p className="text-muted">
            {[item.category, item.condition].filter(Boolean).join(" · ")} · <span className="font-mono">kr {kr(item.price)}</span>
          </p>
        )}
        {type === "kjop" && (
          <p className="rounded-[10px] bg-amber-soft px-4 py-3 text-sm">
            Send forespørselen, så bekrefter vi at varen er din.{" "}
            {vipps ? (
              <>
                Betal med Vipps til <strong className="font-mono">{vipps}</strong> og hent varen i butikken.
              </>
            ) : (
              "Du betaler og henter varen i butikken."
            )}
          </p>
        )}
        {type === "reserver" && (
          <p className="rounded-[10px] bg-amber-soft px-4 py-3 text-sm">
            Vi holder av varen og tar kontakt for å avtale når du kan se på den.
          </p>
        )}

        {state.status === "ok" ? (
          <>
            <p className="rounded-lg bg-moss-soft p-4">
              <strong>{type === "melding" ? "Meldingen er sendt." : "Forespørselen er sendt."}</strong> Vi tar kontakt så snart vi kan.
            </p>
            <div className="flex justify-end">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Lukk
              </button>
            </div>
          </>
        ) : (
          <form action={action} className="grid gap-3.5">
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="itemId" value={item?._id ?? ""} />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold">
                Navn
                <input name="name" required autoComplete="name" className="field py-3 font-normal sm:py-2.5" />
              </label>
              <label className="grid gap-1.5 text-sm font-bold">
                Telefon
                <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field py-3 font-normal sm:py-2.5" />
              </label>
            </div>
            <label className="grid gap-1.5 text-sm font-bold">
              {type === "melding" ? "E-post (valgfritt, hvis du vil ha svar på e-post)" : "E-post (valgfritt)"}
              <input name="email" type="email" autoComplete="email" inputMode="email" className="field py-3 font-normal sm:py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              {type === "melding" ? "Melding" : "Kommentar (valgfritt)"}
              <textarea name="note" rows={4} required={type === "melding"} className="field py-3 font-normal sm:py-2.5" />
            </label>
            {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} />}
            <p className="text-xs text-muted">
              Vi bruker kontaktinfoen din bare til å svare deg, og sletter forespørselen når saken er avsluttet.
            </p>
            {state.status === "error" && (
              <p role="alert" className="text-sm text-heart">
                {state.message}
              </p>
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <button type="button" className="btn justify-center border-transparent bg-transparent" onClick={onClose}>
                Avbryt
              </button>
              <button type="submit" className="btn btn-primary justify-center py-3 sm:py-2" disabled={pending}>
                {pending ? "Sender…" : type === "melding" ? "Send melding" : "Send forespørsel"}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
