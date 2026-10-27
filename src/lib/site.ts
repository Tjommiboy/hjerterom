import type { SiteSettings } from "@/sanity/types";

/** Shop details used when the matching field in Sanity (Butikkinfo) is empty. */
export const SHOP_DEFAULTS = {
  name: "Hjerterom i Bergen",
  address: "Steinestøvegen 283, 5131 Bergen",
  phone: "920 79 960",
  email: "hjerteromibergen@gmail.com",
} as const;

/** Sanity values win; empty fields fall back to SHOP_DEFAULTS. */
export function withDefaults(s: SiteSettings | null): SiteSettings {
  return {
    ...s,
    address: s?.address || SHOP_DEFAULTS.address,
    phone: s?.phone || SHOP_DEFAULTS.phone,
    email: s?.email || SHOP_DEFAULTS.email,
  };
}

export const mapsLink = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
export const mapsEmbed = (address: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
