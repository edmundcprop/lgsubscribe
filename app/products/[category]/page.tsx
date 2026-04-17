import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import {
  categories,
  getCategory,
  getProductsByCategory,
} from "@/lib/products";
import { whatsappLink, absoluteUrl } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/jsonld";

export const generateStaticParams = () =>
  categories.map((c) => ({ category: c.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> => {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return { title: "Category" };
  const items = getProductsByCategory(category);
  const prices = items
    .map((p) => p.price)
    .filter((p): p is number => typeof p === "number");
  const minPrice = prices.length ? Math.min(...prices) : undefined;

  const title = minPrice
    ? `LG ${c.name} Malaysia — Subscribe from RM${minPrice}/month`
    : `LG ${c.name} Malaysia — Subscription Plans`;
  const description = `${c.description} Browse ${items.length} LG ${c.name.toLowerCase()} with pricing and full specs. LG Subscribe Malaysia.`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${c.slug}` },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/products/${c.slug}`),
      type: "website",
      images: [{ url: c.hero, width: 1600, height: 1062, alt: c.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [c.hero],
    },
  };
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const items = getProductsByCategory(category);
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: c.name, url: `/products/${c.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <section className="relative overflow-hidden bg-lg-ink text-white">
        <img
          src={c.hero}
          alt={c.name}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-lg-ink/95 via-lg-ink/70 to-transparent" />
        <div className="container-xl relative py-28 sm:py-32 lg:py-40">
          <Link
            href="/products"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-white"
          >
            ← All Products
          </Link>
          <div className="mt-10 max-w-3xl">
            <div className="eyebrow text-lg-red-light">{c.short}</div>
            <h1 className="display mt-6 text-balance">{c.name}</h1>
            <p className="lede mt-8 max-w-2xl text-balance text-white/70">
              {c.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsappLink(
                  `Hi, I'd like to know more about LG ${c.name} subscription plans.`
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                Ask on WhatsApp
              </a>
              <Link
                href="/enquire"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-[15px] font-medium text-white hover:bg-white hover:text-lg-ink"
              >
                Subscribe form
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-white">
        <div className="container-xl">
          {items.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-lg-stone">
              More models launching soon. Chat with us on WhatsApp for the
              latest lineup.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
