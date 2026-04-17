import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import JsonLd from "@/components/JsonLd";
import T from "@/components/T";
import {
  getCategory,
  getProduct,
  getProductsByCategory,
  products,
} from "@/lib/products";
import { getProductMs } from "@/lib/products-ms";
import { whatsappLink, absoluteUrl } from "@/lib/site";
import {
  productSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/jsonld";

export const generateStaticParams = () =>
  products.map((p) => ({ category: p.category, slug: p.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> => {
  const { category, slug } = await params;
  const p = getProduct(category, slug);
  if (!p) return { title: "Product" };

  const priceFragment = p.price
    ? `From RM${p.price}/month`
    : p.outright
      ? `From RM${p.outright.toLocaleString()}`
      : "Enquire for pricing";

  const description = `${p.tagline} ${priceFragment}. Free delivery, installation and care included with LG Subscribe Malaysia.`;

  const canonical = `/products/${p.category}/${p.slug}`;

  return {
    title: `${p.name}${p.model ? ` (${p.model})` : ""} — ${priceFragment}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: p.name,
      description,
      url: absoluteUrl(canonical),
      type: "website",
      images: [
        {
          url: p.image,
          width: 1600,
          height: 1062,
          alt: p.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: p.name,
      description,
      images: [p.image],
    },
  };
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) notFound();
  const cat = getCategory(category)!;
  const related = getProductsByCategory(category)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const enquiryMsg = product.price
    ? `Hi, I'd like to subscribe to the ${product.name}${product.model ? ` (${product.model})` : ""} — RM${product.price}/month for ${product.term ?? 60} months.`
    : `Hi, I'd like to subscribe to the ${product.name}.`;

  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const pricingTiers =
    product.pricing && product.pricing.length > 0
      ? product.pricing
      : product.price
        ? [
            {
              monthly: product.price,
              termMonths: product.term ?? 60,
              planName: `${product.term ?? 60}-Month Subscription`,
              note: "Delivery, installation and care included",
            },
          ]
        : [];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: cat.name, url: `/products/${cat.slug}` },
    { name: product.name, url: `/products/${cat.slug}/${product.slug}` },
  ];

  const ms = getProductMs(product.slug);

  return (
    <>
      <JsonLd data={productSchema(product, cat.name)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {product.faqs && product.faqs.length > 0 && (
        <JsonLd data={faqSchema(product.faqs)} />
      )}

      {/* BREADCRUMB */}
      <section className="border-b border-black/[0.05] bg-white">
        <div className="container-xl py-5 text-[12px] text-lg-stone">
          <Link href="/products" className="hover:text-lg-red">
            <T en="Products" ms="Produk" />
          </Link>
          <span className="mx-2 text-lg-silver">/</span>
          <Link href={`/products/${cat.slug}`} className="hover:text-lg-red">
            {cat.name}
          </Link>
          <span className="mx-2 text-lg-silver">/</span>
          <span className="text-lg-ink">{product.name}</span>
        </div>
      </section>

      {/* HERO */}
      <section className="bg-white pb-20 pt-16 lg:pt-20">
        <div className="container-xl grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={images} alt={product.name} />
          </div>

          <div className="flex flex-col">
            {product.model && (
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lg-silver">
                {product.model}
              </div>
            )}
            <h1 className="display mt-4 text-balance">{product.name}</h1>
            <p className="lede mt-6 max-w-xl">
              <T en={product.tagline} ms={ms?.tagline ?? product.tagline} />
            </p>

            {/* PRICING CARD */}
            <div className="mt-10 rounded-[24px] bg-lg-mist p-8">
              {pricingTiers.length > 0 ? (
                <>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lg-stone">
                    <T en="Subscribe from" ms="Langgan dari" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-semibold tracking-tight text-lg-ink">
                      RM
                      {Math.min(...pricingTiers.map((t) => t.monthly))}
                    </span>
                    <span className="text-lg text-lg-stone">
                      /<T en="month" ms="bulan" />
                    </span>
                  </div>

                  {pricingTiers.length > 1 ? (
                    <div className="mt-6 space-y-2">
                      {pricingTiers.map((t, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-[13px]"
                        >
                          <div>
                            <div className="font-semibold text-lg-ink">
                              {t.planName ?? `${t.termMonths}-Month Plan`}
                            </div>
                            {t.note && (
                              <div className="mt-0.5 text-[12px] text-lg-stone">
                                {t.note}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg-ink">
                              RM{t.monthly}/mo
                            </div>
                            <div className="text-[11px] text-lg-stone">
                              {t.termMonths} <T en="months" ms="bulan" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-[13px] text-lg-stone">
                      <T
                        en={`${pricingTiers[0].termMonths}-month plan`}
                        ms={`Pelan ${pricingTiers[0].termMonths} bulan`}
                      />
                      {pricingTiers[0].note
                        ? ` · ${pricingTiers[0].note}`
                        : ""}
                    </div>
                  )}

                  {product.outright && (
                    <div className="mt-6 border-t border-black/[0.08] pt-4 text-[12px] text-lg-stone">
                      <T en="Or outright from" ms="Atau tunai dari" />{" "}
                      <span className="font-semibold text-lg-ink">
                        RM{product.outright.toLocaleString()}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lg-stone">
                    <T en="Pricing" ms="Harga" />
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-lg-ink">
                    {product.outright ? (
                      <>
                        <T en="From" ms="Dari" /> RM
                        {product.outright.toLocaleString()}
                      </>
                    ) : (
                      <T
                        en="Contact us for a quote"
                        ms="Hubungi kami untuk sebut harga"
                      />
                    )}
                  </div>
                  <div className="mt-3 text-[13px] text-lg-stone">
                    <T
                      en="Chat with our consultants for the latest plans."
                      ms="Sembang dengan perunding kami untuk pelan terkini."
                    />
                  </div>
                </>
              )}
              <div className="mt-4 text-[11px] text-lg-stone/60">
                <T
                  en="Sold and serviced by an authorised LG Subscribe reseller in Malaysia."
                  ms="Dijual dan diservis oleh penjual semula LG Subscribe yang sah di Malaysia."
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink(enquiryMsg)}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                <T
                  en="Subscribe via WhatsApp"
                  ms="Langgan melalui WhatsApp"
                />
              </a>
              <Link
                href={`/enquire?product=${encodeURIComponent(product.name)}`}
                className="btn-outline"
              >
                <T en="Subscribe form" ms="Borang langganan" />
              </Link>
            </div>

            <ul className="mt-12 space-y-4">
              {product.features.slice(0, 6).map((f, i) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-[14px] text-lg-ink"
                >
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-lg-red" />
                  <span>
                    <T en={f} ms={ms?.features?.[i] ?? f} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      {product.heroDescription && (
        <section className="border-y border-black/[0.05] bg-lg-mist">
          <div className="container-xl py-24 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="eyebrow">
                <T en="Overview" ms="Gambaran" />
              </div>
              <p className="mt-6 text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-[1.4] text-balance text-lg-ink">
                <T
                  en={product.heroDescription}
                  ms={ms?.heroDescription ?? product.heroDescription}
                />
              </p>
            </div>
          </div>
        </section>
      )}

      {/* LONG-FORM SECTIONS */}
      {product.sections && product.sections.length > 0 && (
        <section className="section bg-white">
          <div className="container-xl">
            {product.sections.some((s) => s.image) ? (
              <div className="space-y-24 lg:space-y-32">
                {product.sections.map((s, i) => {
                  const reversed = i % 2 === 1;
                  const msSec = ms?.sections?.[i];
                  return (
                    <div
                      key={s.heading}
                      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                        reversed ? "lg:[&>div:first-child]:order-2" : ""
                      }`}
                    >
                      <div>
                        <div className="eyebrow">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 className="headline mt-4 text-balance">
                          <T en={s.heading} ms={msSec?.heading ?? s.heading} />
                        </h3>
                        <p className="lede mt-6 max-w-lg">
                          <T en={s.body} ms={msSec?.body ?? s.body} />
                        </p>
                        {s.caption && (
                          <p className="mt-5 text-[12px] text-lg-silver">
                            <T
                              en={s.caption}
                              ms={msSec?.caption ?? s.caption}
                            />
                          </p>
                        )}
                      </div>
                      <div className="overflow-hidden rounded-[32px] bg-lg-mist">
                        {/\.(mp4|webm)$/i.test(s.image ?? "") ? (
                          <video
                            src={s.image!}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={s.image ?? product.image}
                            alt={s.heading}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <div className="mx-auto max-w-3xl text-center">
                  <div className="eyebrow">
                    <T en="Features" ms="Ciri-ciri" />
                  </div>
                  <h2 className="headline mt-5 text-balance">
                    <T
                      en="What makes it special."
                      ms="Apa yang menjadikannya istimewa."
                    />
                  </h2>
                </div>
                <div className="mt-16 grid gap-6 md:grid-cols-2">
                  {product.sections.map((s, i) => {
                    const msSec = ms?.sections?.[i];
                    return (
                      <div
                        key={s.heading}
                        className="rounded-[28px] bg-lg-mist p-10"
                      >
                        <div className="text-[13px] font-semibold text-lg-red">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">
                          <T en={s.heading} ms={msSec?.heading ?? s.heading} />
                        </h3>
                        <p className="mt-3 text-[14px] leading-relaxed text-lg-stone">
                          <T en={s.body} ms={msSec?.body ?? s.body} />
                        </p>
                        {s.caption && (
                          <p className="mt-4 text-[11px] text-lg-silver">
                            <T
                              en={s.caption}
                              ms={msSec?.caption ?? s.caption}
                            />
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* SPECS */}
      {product.specs.length > 0 && (
        <section className="section-sm bg-lg-mist">
          <div className="container-xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="eyebrow">
                <T en="Specifications" ms="Spesifikasi" />
              </div>
              <h2 className="headline mt-5">
                <T en="The fine detail." ms="Butiran terperinci." />
              </h2>
            </div>
            <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[28px] bg-white">
              <dl className="divide-y divide-black/[0.06]">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="grid grid-cols-3 gap-4 px-8 py-5 text-[14px]"
                  >
                    <dt className="text-lg-stone">{s.label}</dt>
                    <dd className="col-span-2 font-medium text-lg-ink">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* WHATS IN BOX + WARRANTY */}
      {(product.whatsInBox || product.warranty) && (
        <section className="section-sm bg-white">
          <div className="container-xl grid gap-6 lg:grid-cols-2">
            {product.whatsInBox && (
              <div className="rounded-[28px] bg-lg-mist p-10">
                <div className="eyebrow">
                  <T en="In the box" ms="Dalam kotak" />
                </div>
                <h3 className="title mt-4">
                  <T en="What you'll receive" ms="Apa yang anda terima" />
                </h3>
                <ul className="mt-6 space-y-3 text-[14px] text-lg-ink">
                  {product.whatsInBox.map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-lg-red" />
                      <span>
                        <T en={item} ms={ms?.whatsInBox?.[i] ?? item} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.warranty && (
              <div className="rounded-[28px] bg-lg-mist p-10">
                <div className="eyebrow">
                  <T en="Warranty & care" ms="Waranti & penjagaan" />
                </div>
                <h3 className="title mt-4">
                  <T en="Peace of mind" ms="Ketenangan fikiran" />
                </h3>
                <p className="mt-6 text-[14px] leading-relaxed text-lg-stone">
                  <T
                    en={product.warranty}
                    ms={ms?.warranty ?? product.warranty}
                  />
                </p>
                <p className="mt-4 text-[14px] leading-relaxed text-lg-stone">
                  <T
                    en="LG Subscribe plans include free delivery, installation and scheduled care throughout your term."
                    ms="Pelan LG Subscribe termasuk penghantaran percuma, pemasangan dan penjagaan berjadual sepanjang tempoh langganan anda."
                  />
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQS */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="section bg-lg-mist">
          <div className="container-xl grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
            <div>
              <div className="eyebrow">
                <T en="FAQ" ms="Soalan Lazim" />
              </div>
              <h2 className="headline mt-5 text-balance">
                <T
                  en={`Questions about the ${product.model ?? product.name}?`}
                  ms={`Soalan tentang ${product.model ?? product.name}?`}
                />
              </h2>
              <p className="lede mt-6">
                <T
                  en="Still unsure? Our consultants are one WhatsApp message away."
                  ms="Masih ragu-ragu? Perunding kami hanya satu mesej WhatsApp jauh."
                />
              </p>
              <a
                href={whatsappLink(enquiryMsg)}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp mt-8"
              >
                <T en="Ask on WhatsApp" ms="Tanya di WhatsApp" />
              </a>
            </div>
            <div>
              <div className="divide-y divide-black/10">
                {product.faqs.map((f, i) => {
                  const msFaq = ms?.faqs?.[i];
                  return (
                    <details key={f.q} className="group py-6">
                      <summary className="flex cursor-pointer items-center justify-between gap-6 text-lg font-semibold text-lg-ink">
                        <span>
                          <T en={f.q} ms={msFaq?.q ?? f.q} />
                        </span>
                        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-black/10 text-lg-red transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-lg-stone">
                        <T en={f.a} ms={msFaq?.a ?? f.a} />
                      </p>
                    </details>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="section-sm bg-white">
          <div className="container-xl">
            <div className="flex items-end justify-between">
              <div>
                <div className="eyebrow">
                  <T
                    en={`More from ${cat.name}`}
                    ms={`Lagi dari ${cat.name}`}
                  />
                </div>
                <h2 className="headline mt-5">
                  <T en="You might also like." ms="Anda mungkin juga suka." />
                </h2>
              </div>
              <Link
                href={`/products/${cat.slug}`}
                className="btn-ghost hidden sm:inline-flex"
              >
                <T en="View all →" ms="Lihat semua →" />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.category}/${p.slug}`}
                  className="product-card group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-lg-cloud">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="bg-white px-6 py-8">
                    {p.model && (
                      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-silver">
                        {p.model}
                      </div>
                    )}
                    <h3 className="mt-2 text-lg font-semibold text-lg-ink">
                      {p.name}
                    </h3>
                    <div className="mt-5 text-[14px] font-medium text-lg-red">
                      {p.price ? `From RM${p.price}/mo →` : "Enquire →"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
