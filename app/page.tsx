import Link from "next/link";
import { categories, products } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import T from "@/components/T";
import {
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  faqSchema,
} from "@/lib/jsonld";
import homepage from "@/data/homepage.json";

const { valueProps, testimonials, scenarios, steps, faqs, featuredSlugs } =
  homepage;

export default function HomePage() {
  const featured = featuredSlugs
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean) as typeof products;

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={websiteSchema()} />
      {faqs && faqs.length > 0 && (
        <JsonLd data={faqSchema(faqs)} />
      )}

      {/* HERO — full-viewport image with overlaid text */}
      <section className="relative">
        <div className="relative h-[calc(100vh-56px)] min-h-[640px] overflow-hidden bg-lg-ink">
          <img
            src="/uploads/site/scenario-upgrade-15.avif"
            alt="LG OLED TV in a modern Malaysian living room — LG Subscribe from RM60 a month"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-lg-ink via-lg-ink/40 to-lg-ink/10" />
          <div className="container-xl relative flex h-full flex-col justify-end pb-20 sm:pb-24 lg:pb-28">
            <div className="max-w-3xl text-white">
              <div className="eyebrow text-lg-red-light">
                LG Subscribe Malaysia
              </div>
              <h1 className="display mt-6 text-balance">
                <T
                  en="Your home,"
                  ms="Rumah anda,"
                />
                <br />
                <T
                  en="effortlessly upgraded."
                  ms="dinaiktarafkan dengan mudah."
                />
              </h1>
              <p className="lede mt-8 max-w-xl text-balance text-white/75">
                <T
                  en="Premium LG appliances for every room — from RM60 a month. No upfront cost. Free delivery, installation and care, included."
                  ms="Peralatan LG premium untuk setiap bilik — dari RM60 sebulan. Tiada kos pendahuluan. Penghantaran, pemasangan dan penjagaan percuma — disertakan."
                />
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center rounded-full bg-white px-7 text-[15px] font-medium text-lg-ink transition hover:bg-white/90"
                >
                  <T en="Browse all products" ms="Lihat semua produk" />
                </Link>
                <a
                  href={whatsappLink(
                    "Hi, I'd like to know more about LG Subscribe plans."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-1 text-[15px] font-medium text-white transition hover:text-white/80"
                >
                  <T
                    en="Chat with us on WhatsApp →"
                    ms="Sembang di WhatsApp →"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION STRIP */}
      <section className="border-b border-black/[0.05] bg-white">
        <div className="container-xl py-16 sm:py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((v) => (
              <div key={v.titleEn} className="flex flex-col">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lg-red/10 text-lg-red">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
                <div className="mt-6 text-lg font-semibold text-lg-ink">
                  <T en={v.titleEn} ms={v.titleMs} />
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-lg-stone">
                  <T en={v.bodyEn} ms={v.bodyMs} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY / SCENARIOS */}
      <section id="why" className="section bg-white">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <T en="Why LG Subscribe" ms="Kenapa LG Subscribe" />
            </div>
            <h2 className="headline mt-5 text-balance">
              <T
                en="Built for the way Malaysian families live."
                ms="Dibina untuk gaya hidup keluarga Malaysia."
              />
            </h2>
            <p className="lede mx-auto mt-6 max-w-2xl text-balance">
              <T
                en="Whether you're moving into a new home, renovating, or ready for an upgrade — we make premium LG effortless."
                ms="Sama ada anda berpindah ke rumah baru, mengubah suai, atau bersedia untuk naik taraf — kami menjadikan LG premium mudah."
              />
            </p>
          </div>

          <div className="mt-20 space-y-20 lg:space-y-28">
            {scenarios.map((s, i) => {
              const reversed = i % 2 === 1;
              return (
                <div
                  key={s.labelEn}
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                    reversed ? "lg:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <div className="eyebrow">
                      <T en={s.labelEn} ms={s.labelMs} />
                    </div>
                    <h3 className="headline mt-4 text-balance">
                      <T en={s.titleEn} ms={s.titleMs} />
                    </h3>
                    <p className="lede mt-6 max-w-lg">
                      <T en={s.bodyEn} ms={s.bodyMs} />
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-[32px] bg-lg-mist">
                    <img
                      src={s.image}
                      alt={s.titleEn}
                      className="h-[420px] w-full object-cover sm:h-[520px]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <T
                en="Trusted by Malaysian families"
                ms="Dipercayai keluarga Malaysia"
              />
            </div>
            <h2 className="headline mt-5 text-balance">
              <T
                en="Homes already living well with LG Subscribe."
                ms="Keluarga yang sudah hidup lebih selesa dengan LG Subscribe."
              />
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="flex flex-col rounded-[28px] bg-lg-mist p-10"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-6 w-6 text-lg-red"
                  fill="currentColor"
                >
                  <path d="M9 7H5a2 2 0 00-2 2v4a2 2 0 002 2h3v2a2 2 0 01-2 2H5v2h1a4 4 0 004-4v-8a2 2 0 00-1-1zm10 0h-4a2 2 0 00-2 2v4a2 2 0 002 2h3v2a2 2 0 01-2 2h-1v2h1a4 4 0 004-4v-8a2 2 0 00-1-1z" />
                </svg>
                <blockquote className="mt-5 flex-1 text-[15px] leading-[1.65] text-lg-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-black/[0.08] pt-5">
                  <div className="text-[14px] font-semibold text-lg-ink">
                    {t.name}
                  </div>
                  <div className="mt-1 text-[12px] text-lg-stone">
                    {t.location}
                  </div>
                  <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-lg-red">
                    {t.products}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-[12px] text-lg-stone">
            <T
              en="Names and locations are illustrative. Based on typical LG Subscribe scenarios in Malaysia."
              ms="Nama dan lokasi adalah ilustrasi. Berdasarkan senario pelanggan LG Subscribe biasa di Malaysia."
            />
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section bg-lg-mist">
        <div className="container-xl">
          <div className="flex items-end justify-between">
            <div>
              <div className="eyebrow">
                <T en="Shop" ms="Beli-belah" />
              </div>
              <h2 className="headline mt-5 text-balance">
                <T
                  en="Every category, one subscription."
                  ms="Setiap kategori, satu langganan."
                />
              </h2>
            </div>
            <Link
              href="/products"
              className="btn-ghost hidden sm:inline-flex"
            >
              <T en="View all →" ms="Lihat semua →" />
            </Link>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className="group relative flex h-[380px] overflow-hidden rounded-[28px] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <img
                  src={c.hero}
                  alt={c.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative mt-auto p-8 text-white">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    {c.short}
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{c.name}</div>
                  <div className="mt-3 text-[13px] text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <T en="Featured" ms="Pilihan" />
            </div>
            <h2 className="headline mt-5 text-balance">
              <T
                en="Popular with Malaysian homes."
                ms="Popular dalam kalangan keluarga Malaysia."
              />
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
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
                <div className="flex flex-1 flex-col bg-white px-6 py-8">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-silver">
                    {p.model}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-lg-ink">
                    {p.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[14px] text-lg-stone">
                    {p.tagline}
                  </p>
                  <div className="mt-auto pt-6">
                    {p.price ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[13px] text-lg-stone">From</span>
                        <span className="text-xl font-semibold text-lg-ink">
                          RM{p.price}
                        </span>
                        <span className="text-[13px] text-lg-stone">
                          /month
                        </span>
                      </div>
                    ) : (
                      <span className="text-[14px] font-medium text-lg-red">
                        Contact us →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section bg-lg-mist">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <T en="How it works" ms="Cara kerjanya" />
            </div>
            <h2 className="headline mt-5 text-balance">
              <T
                en="Six steps, typically 1–2 weeks."
                ms="Enam langkah, biasanya 1–2 minggu."
              />
            </h2>
            <p className="lede mx-auto mt-6 max-w-2xl text-balance">
              <T
                en="From browsing to the moment a technician walks you through your new appliance — here's exactly what happens."
                ms="Dari melihat-lihat sehingga saat juruteknik menunjukkan anda cara menggunakan peralatan baharu — inilah yang berlaku langkah demi langkah."
              />
            </p>
          </div>
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-[24px] bg-white p-8 transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="text-4xl font-semibold tracking-tight text-lg-red">
                  {s.n}
                </div>
                <div className="mt-6 text-lg font-semibold">{s.title}</div>
                <p className="mt-3 text-[14px] leading-relaxed text-lg-stone">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* Plan summary strip */}
          <div className="mt-20 rounded-[28px] bg-white p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <div>
                <div className="eyebrow">
                  <T en="Plan terms" ms="Tempoh pelan" />
                </div>
                <h3 className="title mt-4 text-balance">
                  <T en="60, 84, or outright." ms="60, 84 bulan atau tunai." />
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-lg-stone">
                  <T
                    en="Most products come with a 5-year (60-month) or 7-year (84-month) term. Selected products — like xboom speakers and a few purifiers — are available outright only."
                    ms="Kebanyakan produk ditawarkan dengan tempoh 5 tahun (60 bulan) atau 7 tahun (84 bulan). Produk terpilih — seperti pembesar suara xboom dan beberapa penulen — hanya tersedia secara tunai."
                  />
                </p>
                <Link href="/how-it-works" className="btn-ghost mt-6 inline-flex">
                  <T en="Read the full guide →" ms="Baca panduan lengkap →" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-lg-mist p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-red">
                    <T en="5-Year Plan" ms="Pelan 5 Tahun" />
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight text-lg-ink">
                    60
                    <span className="text-base font-normal text-lg-stone">
                      {" "}
                      <T en="months" ms="bulan" />
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-lg-stone">
                    <T
                      en="Shorter commitment, slightly higher monthly rate."
                      ms="Komitmen lebih pendek, bayaran bulanan sedikit lebih tinggi."
                    />
                  </p>
                </div>
                <div className="rounded-2xl bg-lg-ink p-6 text-white">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-red-light">
                    <T en="7-Year Plan" ms="Pelan 7 Tahun" />
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight">
                    84
                    <span className="text-base font-normal text-white/70">
                      {" "}
                      <T en="months" ms="bulan" />
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-white/70">
                    <T
                      en="Lowest monthly rate. Best for long-term holds."
                      ms="Bayaran bulanan paling rendah. Sesuai untuk jangka panjang."
                    />
                  </p>
                </div>
                <div className="rounded-2xl bg-lg-mist p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-red">
                    <T en="Outright" ms="Tunai" />
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight text-lg-ink">
                    <T en="One-time" ms="Sekali bayar" />
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-lg-stone">
                    <T
                      en="Selected products only. 0% instalment via major banks."
                      ms="Produk terpilih sahaja. Ansuran 0% melalui bank-bank utama."
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-lg-mist">
        <div className="container-xl grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
          <div>
            <div className="eyebrow">
              <T en="Support" ms="Sokongan" />
            </div>
            <h2 className="headline mt-5 text-balance">
              <T
                en="Questions, answered."
                ms="Jawapan untuk setiap soalan."
              />
            </h2>
            <p className="lede mt-6">
              <T
                en="Still unsure? Our consultants are one WhatsApp message away — we're here to help."
                ms="Masih ragu-ragu? Perunding kami hanya satu mesej WhatsApp jauh — kami sedia membantu."
              />
            </p>
            <a
              href={whatsappLink("Hi, I have a question about LG Subscribe.")}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp mt-8"
            >
              <T en="Chat on WhatsApp" ms="Sembang di WhatsApp" />
            </a>
          </div>
          <div>
            <div className="divide-y divide-black/10">
              {faqs.map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 text-lg font-semibold text-lg-ink">
                    <span>{f.q}</span>
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-black/10 text-lg-red transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-lg-stone">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-white">
        <div className="container-xl">
          <div className="relative overflow-hidden rounded-[32px] bg-lg-ink px-10 py-20 text-white sm:px-16 sm:py-24 lg:px-24 lg:py-32">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 80% 30%, #A50034 0%, transparent 55%)",
              }}
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="eyebrow text-lg-red-light">
                <T en="Ready when you are" ms="Sedia apabila anda sedia" />
              </div>
              <h2 className="display mt-6 text-balance">
                <T
                  en="Start your LG story today."
                  ms="Mulakan kisah LG anda hari ini."
                />
              </h2>
              <p className="lede mx-auto mt-8 max-w-xl text-balance text-white/70">
                <T
                  en="Get a personalised plan in minutes. No credit card required at sign-up."
                  ms="Dapatkan pelan yang disesuaikan dalam beberapa minit. Tiada kad kredit diperlukan semasa pendaftaran."
                />
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/enquire"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[15px] font-medium text-lg-ink hover:bg-white/90"
                >
                  <T en="Subscribe now" ms="Langgan sekarang" />
                </Link>
                <a
                  href={whatsappLink(
                    "Hi, I'd like a plan recommendation for LG Subscribe."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  WhatsApp {site.whatsapp.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
