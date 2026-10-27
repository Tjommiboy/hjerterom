import { defineQuery } from "next-sanity";

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  tagline, lede, hours, about, address, phone, email, vipps
}`);

export const UPCOMING_EVENTS_QUERY = defineQuery(`*[_type == "post" && kind == "arrangement" && eventDate >= $today]
  | order(eventDate asc, eventTime asc){
  _id, kind, title, body, eventDate, eventTime, place, image, publishedAt
}`);

export const NEWS_QUERY = defineQuery(`*[_type == "post" && kind == "nyhet"] | order(publishedAt desc)[0...20]{
  _id, kind, title, body, image, publishedAt
}`);

export const ITEMS_QUERY = defineQuery(`*[_type == "item"] | order(publishedAt desc){
  _id, title, description, price, category, condition, status, buyMode, image, publishedAt
}`);
