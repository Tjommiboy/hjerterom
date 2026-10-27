import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type ItemStatus = "ledig" | "reservert" | "solgt";
export type BuyMode = "begge" | "kjop" | "reserver";
export type RequestType = "kjop" | "reserver" | "melding";

export type Post = {
  _id: string;
  kind: "nyhet" | "arrangement";
  title: string;
  body?: string;
  eventDate?: string; // YYYY-MM-DD
  eventTime?: string;
  place?: string;
  image?: SanityImageSource;
  publishedAt: string;
};

export type Item = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  condition?: string;
  status: ItemStatus;
  buyMode: BuyMode;
  image?: SanityImageSource;
  publishedAt: string;
};

export type SiteSettings = {
  tagline?: string;
  lede?: string;
  hours?: string;
  about?: string;
  address?: string;
  phone?: string;
  email?: string;
  vipps?: string;
};
