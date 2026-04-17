import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — LG Subscribe Malaysia Buying Guides & Tips",
  description:
    "Honest buying guides and tips for Malaysian families considering LG Subscribe — rent vs buy, moving home, renovation, and product comparisons.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "LG Subscribe Malaysia Blog",
    description:
      "Honest buying guides for Malaysian families — rent vs buy, moving home, and product comparisons.",
    url: absoluteUrl("/blog"),
    type: "website",
  },
};

export default function BlogIndexPage() {
  return (
    <>
      <section className="bg-lg-mist">
        <div className="container-xl py-24 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">The Journal</div>
            <h1 className="display mt-6 text-balance">
              Honest guides for Malaysian homes.
            </h1>
            <p className="lede mx-auto mt-8 max-w-2xl text-balance">
              Rent vs buy, moving home, renovation, product comparisons — the
              kind of answers you can&apos;t get from a showroom.
            </p>
          </div>
        </div>
      </section>

      <section className="section-sm bg-white">
        <div className="container-xl">
          <div className="grid gap-10 lg:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-[28px] bg-lg-mist transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden bg-lg-cloud">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col bg-white p-10">
                  <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
                    <span className="text-lg-red">{p.category}</span>
                    <span>·</span>
                    <span>{p.readingTime}</span>
                  </div>
                  <h2 className="title mt-4 text-balance">{p.title}</h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-lg-stone">
                    {p.excerpt}
                  </p>
                  <div className="mt-auto pt-6 text-[13px] font-medium text-lg-red">
                    Read article →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
