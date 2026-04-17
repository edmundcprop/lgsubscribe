import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Products — LG Appliances for Subscription",
  description:
    "Browse the full range of LG appliances available on subscription in Malaysia — water purifiers, air purifiers, airconds, washers, TVs, fridges, and more. Plans from RM50/month.",
  alternates: { canonical: "/products/" },
  openGraph: {
    title: "All Products — LG Subscribe Malaysia",
    description:
      "Browse LG appliances available on subscription in Malaysia. Plans from RM50/month with free delivery and installation.",
    url: absoluteUrl("/products/"),
    type: "website",
  },
};

export default function AllProductsPage() {
  return (
    <>
      <section className="bg-lg-mist">
        <div className="container-xl py-24 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="eyebrow">The Store</div>
            <h1 className="display mt-6 text-balance">
              Every LG, one subscription.
            </h1>
            <p className="lede mx-auto mt-8 max-w-2xl text-balance">
              Browse the full lineup — TVs, refrigerators, washers, air
              conditioners, water and air purifiers, and more.
            </p>
          </div>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-lg-ink transition hover:border-lg-red hover:text-lg-red"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {categories.map((c) => {
        const items = products.filter((p) => p.category === c.slug);
        if (!items.length) return null;
        return (
          <section key={c.slug} className="section-sm bg-white">
            <div className="container-xl">
              <div className="flex items-end justify-between">
                <div>
                  <div className="eyebrow">{c.short}</div>
                  <h2 className="headline mt-5">{c.name}</h2>
                </div>
                <Link
                  href={`/products/${c.slug}`}
                  className="btn-ghost hidden sm:inline-flex"
                >
                  View category →
                </Link>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
