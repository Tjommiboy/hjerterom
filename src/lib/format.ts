const MONTHS = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

/** Today's date in Norway as YYYY-MM-DD (for "upcoming events" queries). */
export function todayOslo(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo" }).format(new Date());
}

export function dateParts(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return { day: d.getDate(), month: MONTHS[d.getMonth()] };
}

export function longDate(iso: string) {
  return new Intl.DateTimeFormat("nb-NO", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(`${iso}T12:00:00`),
  );
}

export function shortStamp(iso: string) {
  return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Oslo" }).format(
    new Date(iso),
  );
}

export function kr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(n);
}

export function paragraphs(text?: string) {
  return (text ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
