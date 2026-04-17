# LG Subscribe Website

Static marketing site for LG Subscribe Malaysia built with Next.js 15 (App Router) + Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build static site

```bash
npm run build
```

Static output is generated in the `out/` folder — deploy to Netlify, Vercel, or any static host.

## Structure

- `app/` — routes (App Router)
  - `page.tsx` — landing page
  - `products/` — all products + category + detail pages
  - `enquire/` — WhatsApp enquiry form
- `components/` — Header, Footer, ProductCard, WhatsAppFab
- `lib/site.ts` — brand config (WhatsApp number lives here)
- `lib/products.ts` — category + product catalog (edit to add/remove products)

## Customising

- **WhatsApp number:** `lib/site.ts`
- **Products:** `lib/products.ts`
- **Brand colors:** `tailwind.config.ts` (`lg.red`, etc.)
- **Images:** currently uses Unsplash placeholders — replace with LG official assets (drop into `public/images/` and update `lib/products.ts`)
