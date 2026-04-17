/**
 * Bahasa Malaysia translations for product content.
 * Data loaded from JSON — keyed by product slug.
 */

export type ProductMs = {
  tagline?: string;
  heroDescription?: string;
  features?: string[];
  sections?: { heading: string; body: string; caption?: string }[];
  whatsInBox?: string[];
  warranty?: string;
  faqs?: { q: string; a: string }[];
};

import productsMsData from "../data/products-ms.json";

export const productsMs: Record<string, ProductMs> =
  productsMsData as Record<string, ProductMs>;

export const getProductMs = (slug: string): ProductMs | undefined =>
  productsMs[slug];
