# Hjerterom

Website for Hjerterom, a thrift shop and community space in Bergen. Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Sanity.

- **Nytt** (`/`): opening hours, upcoming events and news
- **Varer** (`/varer`): items customers can buy or reserve
- **Om oss** (`/om-oss`) and **Kontakt** (`/kontakt`)
- **Studio** (`/studio`): where the shop edits everything and reads customer requests

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/studio for Sanity Studio.

## Setting up Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage), or run `npx sanity@latest init --env .env.local` and choose "create new project".
2. Put the project id and dataset in `.env.local`.
3. In the project's **API** settings:
   - **CORS origins:** add `http://localhost:3000` and your production URL, both with credentials allowed.
   - **Tokens:** create a token with **Editor** rights and put it in `SANITY_API_WRITE_TOKEN`. The website uses it to save customer requests. Never expose it to the browser.
   - **Webhooks (after deploy):** add a webhook to `https://<domain>/api/revalidate`, on create, update and delete, with projection `{_type}` and a secret that matches `SANITY_REVALIDATE_SECRET`. Published changes then show up immediately; without it, pages refresh within 60 seconds.
4. In Studio, open **Butikkinfo** and fill in opening hours, the About text and contact details.

## Content model

| Type | Purpose |
| --- | --- |
| `post` | News (`nyhet`) or events (`arrangement`, with date, time and place) |
| `item` | Items for sale: price, category, condition, status (ledig/reservert/solgt), and whether customers can buy, reserve or both |
| `siteSettings` | A single document with tagline, intro, opening hours, About text, address, phone, email and Vipps number |
| `request` | Purchase requests, reservations and messages sent from the site. The shop marks them handled in Studio. |

Reservations are handled manually: a request arrives, the shop calls the customer, then sets the item to *Reservert* or *Solgt*.

## Spam protection (Cloudflare Turnstile)

This is optional. Create a Turnstile widget in the Cloudflare dashboard and set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Until then, forms are protected only by a hidden honeypot field.

## Deploying

- **Vercel:** import the repo, add the env vars, and deploy.
- **Cloudflare Workers:** use the OpenNext adapter (`@opennextjs/cloudflare`). See its docs for setup.

## To do

- Email the shop when a new request comes in, for example with Resend, in `src/app/(site)/actions.ts`.
- Add a privacy page (personvernerklæring).
- Add an Open Graph image and favicon.

`docs/prototype.html` is the original clickable prototype the design is based on.
