import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { comparisons, getComparison } from "@/lib/comparisons";
import { getProduct } from "@/lib/products";
import { absoluteUrl, whatsappLink } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/jsonld";

export const generateStaticParams = () =>
  comparisons.map((c) => ({ slug: c.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return { title: "Comparison" };
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/compare/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.description,
      url: absoluteUrl(`/compare/${c.slug}`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
    },
  };
};

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: c.title, url: `/compare/${c.slug}` },
  ];

  const recommended =
    c.recommendedProductSlug && c.recommendedProductCategory
      ? getProduct(c.recommendedProductCategory, c.recommendedProductSlug)
      : undefined;

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section className="border-b border-black/[0.05] bg-white">
        <div className="container-xl py-5 text-[12px] text-lg-stone">
          <Link href="/" className="hover:text-lg-red">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/compare" className="hover:text-lg-red">
            Compare
          </Link>
          <span className="mx-2">/</span>
          <span className="text-lg-ink">{c.title}</span>
        </div>
      </section>

      <section className="bg-lg-mist">
        <div className="container-xl py-20 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="eyebrow">Head to Head</div>
            <h1 className="display mt-6 text-balance">{c.title}</h1>
            <p className="lede mx-auto mt-8 max-w-3xl text-balance">
              {c.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="section-sm bg-white">
        <div className="container-xl">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-[24px] border border-lg-red/20 bg-lg-mist p-8">
              <div className="eyebrow">Our pick</div>
              <h2 className="title mt-3 text-lg-ink">{c.leftName}</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-lg-stone">
                {c.leftTagline}
              </p>
            </div>
            <div className="rounded-[24px] bg-lg-mist p-8">
              <div className="eyebrow text-lg-stone">The alternative</div>
              <h2 className="title mt-3 text-lg-ink">{c.rightName}</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-lg-stone">
                {c.rightTagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-lg-mist">
        <div className="container-xl">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-white">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-black/[0.08] bg-lg-mist/50">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
                    Dimension
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-red">
                    LG PuriCare
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
                    Alternative
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr
                    key={r.label}
                    className="border-b border-black/[0.05] last:border-0"
                  >
                    <td className="px-6 py-5 align-top font-semibold text-lg-ink">
                      {r.label}
                    </td>
                    <td
                      className={`px-6 py-5 align-top leading-relaxed ${
                        r.winner === "left"
                          ? "bg-lg-red/5 text-lg-ink"
                          : "text-lg-stone"
                      }`}
                    >
                      {r.left}
                      {r.winner === "left" && (
                        <span className="mt-2 inline-flex rounded-full bg-lg-red px-2 py-0.5 text-[10px] font-semibold text-white">
                          WINNER
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-5 align-top leading-relaxed ${
                        r.winner === "right"
                          ? "bg-lg-ink/5 text-lg-ink"
                          : "text-lg-stone"
                      }`}
                    >
                      {r.right}
                      {r.winner === "right" && (
                        <span className="mt-2 inline-flex rounded-full bg-lg-ink px-2 py-0.5 text-[10px] font-semibold text-white">
                          WINNER
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-sm bg-white">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow">The verdict</div>
            <h2 className="headline mt-5 text-balance">
              Which should you pick?
            </h2>
            <p className="mt-8 text-[17px] leading-[1.7] text-lg-ink">
              {c.conclusion}
            </p>
            <p className="mt-6 text-[12px] text-lg-stone/60">
              Information about alternative brands is based on publicly
              available data as of April 2026 and may not reflect current
              offerings. LG product specifications and pricing are verified
              from authorised sources. This comparison is provided for
              informational purposes only.
            </p>
          </div>
        </div>
      </section>

      {recommended && (
        <section className="section-sm bg-lg-mist">
          <div className="container-xl">
            <div className="mx-auto max-w-4xl">
              <div className="eyebrow">Our recommendation</div>
              <h2 className="headline mt-5 text-balance">
                Start with the {recommended.name}.
              </h2>
              <Link
                href={`/products/${recommended.category}/${recommended.slug}`}
                className="mt-10 block overflow-hidden rounded-[28px] bg-white transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-[4/3] overflow-hidden bg-lg-cloud">
                    <img
                      src={recommended.image}
                      alt={recommended.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-10">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
                      {recommended.model}
                    </div>
                    <h3 className="title mt-3">{recommended.name}</h3>
                    <p className="mt-3 text-[14px] text-lg-stone">
                      {recommended.tagline}
                    </p>
                    {recommended.price && (
                      <div className="mt-6 text-2xl font-semibold text-lg-ink">
                        From RM{recommended.price}
                        <span className="text-base font-normal text-lg-stone">
                          /month
                        </span>
                      </div>
                    )}
                    <div className="mt-6 text-[13px] font-medium text-lg-red">
                      View product →
                    </div>
                  </div>
                </div>
              </Link>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={whatsappLink(
                    `Hi, I read the comparison "${c.title}" and would like a recommendation.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  Get a recommendation
                </a>
                <Link href="/compare" className="btn-outline">
                  More comparisons
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
