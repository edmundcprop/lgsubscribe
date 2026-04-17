import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/lib/comparisons";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Comparisons — LG Subscribe Malaysia",
  description:
    "Honest side-by-side comparisons of LG Subscribe appliances against competitors and alternative LG models. Written for Malaysian families.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "LG Subscribe Malaysia — Product Comparisons",
    description:
      "Side-by-side comparisons of LG Subscribe appliances for Malaysian families.",
    url: absoluteUrl("/compare"),
    type: "website",
  },
};

export default function CompareIndexPage() {
  return (
    <>
      <section className="bg-lg-mist">
        <div className="container-xl py-24 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">Comparisons</div>
            <h1 className="display mt-6 text-balance">
              Side by side. No spin.
            </h1>
            <p className="lede mx-auto mt-8 max-w-2xl text-balance">
              Honest comparisons between LG Subscribe products and the
              alternatives Malaysian families actually consider.
            </p>
          </div>
        </div>
      </section>

      <section className="section-sm bg-white">
        <div className="container-xl">
          <div className="grid gap-8 md:grid-cols-2">
            {comparisons.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group flex flex-col rounded-[28px] bg-lg-mist p-10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="eyebrow">Comparison</div>
                <h2 className="title mt-4 text-balance">{c.title}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-lg-stone">
                  {c.description}
                </p>
                <div className="mt-auto pt-8 text-[13px] font-medium text-lg-red">
                  Read comparison →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
