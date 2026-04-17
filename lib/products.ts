export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  hero: string;
};

export type PricingTier = {
  monthly: number;
  termMonths: number;
  planName?: string;
  note?: string;
};

export type FAQ = { q: string; a: string };

export type Section = {
  heading: string;
  body: string;
  image?: string;
  caption?: string;
};

export type ProductStatus = "online" | "offline" | "draft";

export type Product = {
  slug: string;
  category: string;
  name: string;
  model: string | null;
  tagline: string;
  /** legacy "from" price — kept for cards; detail page uses `pricing` */
  price: number | null;
  term: number | null;
  outright?: number | null;
  image: string;
  gallery?: string[];
  features: string[];
  specs: { label: string; value: string }[];
  pricing?: PricingTier[];
  whatsInBox?: string[];
  warranty?: string;
  faqs?: FAQ[];
  /** optional long-form product story — rendered as alternating image/text blocks */
  heroDescription?: string;
  sections?: Section[];
  /** Product visibility: online = live, draft = hidden, offline = hidden */
  status?: ProductStatus;
};

import categoriesData from "../data/categories.json";
import productsData from "../data/products.json";

export const categories: Category[] = categoriesData as Category[];
export const products: Product[] = productsData as Product[];

const toSpecs = (obj: Record<string, string>) =>
  Object.entries(obj).map(([k, v]) => ({
    label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: v,
  }));

export { toSpecs };

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

/** Only online products for public pages */
export const getProductsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug && (p.status ?? "online") === "online");

/** Only online products for public pages */
export const getProduct = (category: string, slug: string) => {
  const p = products.find((p) => p.category === category && p.slug === slug);
  if (p && (p.status ?? "online") !== "online") return undefined;
  return p;
};

/** All products regardless of status (for admin/sitemap) */
export const getAllProducts = () => products;

/** All products in a category regardless of status (for admin) */
export const getAllProductsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);
