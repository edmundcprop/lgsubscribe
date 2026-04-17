import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/jsonld";
import { absoluteUrl, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "How LG Subscribe Works in Malaysia — Plans, Care Tiers & Sign-Up",
  description:
    "The full LG Subscribe Malaysia process explained. 6-step sign-up, 60 or 84-month plans, three care tiers, and what's included with every subscription.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How LG Subscribe Works in Malaysia",
    description:
      "Plans, care tiers, eligibility and what's included — the complete LG Subscribe Malaysia walkthrough.",
    url: absoluteUrl("/how-it-works"),
    type: "website",
  },
};

const steps = [
  {
    n: "01",
    title: "Browse & choose",
    time: "15 minutes",
    body: "Explore the LG Subscribe catalogue and pick the product that fits your home. Select a term (60 or 84 months) and a care tier that suits your budget and how hands-on you want to be with maintenance.",
  },
  {
    n: "02",
    title: "Submit your application",
    time: "10 minutes",
    body: "Send us your details via WhatsApp or the enquiry form — full name, IC, delivery address and contact number. Our consultants walk you through any questions and confirm eligibility before anything is signed.",
  },
  {
    n: "03",
    title: "Register your card & sign the e-contract",
    time: "5 minutes",
    body: "Register a credit or debit card for monthly auto-debit and sign the subscription agreement digitally. There's no deposit, no upfront lump sum, and the card's credit limit is not blocked — only the monthly charge is debited each cycle.",
  },
  {
    n: "04",
    title: "LG approves & schedules",
    time: "1–3 working days",
    body: "LG reviews the application (a quick eligibility and credit check — you mustn't be blacklisted) and confirms the order. We then schedule delivery and installation around your availability.",
  },
  {
    n: "05",
    title: "Delivery & professional installation",
    time: "Free, nationwide",
    body: "LG delivers to your doorstep and a technician handles the full installation — unpacking, mounting or placement, commissioning, and a short walkthrough so you know how everything works.",
  },
  {
    n: "06",
    title: "Ongoing care for the whole term",
    time: "Throughout your plan",
    body: "LG proactively contacts you to schedule maintenance visits, ship replacement filters or consumables, and handle any warranty repairs. Your coverage runs for the full term of the plan — 60 or 84 months.",
  },
];

const plans = [
  {
    label: "60 months",
    sublabel: "5-Year Plan",
    headline: "Shorter commitment",
    body: "The standard plan length. Slightly higher monthly rate than the 7-year option, but you finish sooner and can upgrade or renew earlier.",
    bullets: [
      "Available on most products",
      "Full warranty across the 5 years",
      "Free CareShip throughout the term",
    ],
  },
  {
    label: "84 months",
    sublabel: "7-Year Plan",
    headline: "Lower monthly rate",
    body: "Our most affordable plan. Same product and full coverage, stretched over a longer term. Best if you value a lower monthly cost and plan to keep the appliance for the long haul.",
    bullets: [
      "Lowest monthly price",
      "7-year warranty and CareShip",
      "Available on water purifiers, air purifiers, dehumidifiers and selected appliances",
    ],
    featured: true,
  },
  {
    label: "Outright",
    sublabel: "One-time purchase",
    headline: "For selected products",
    body: "Some products — like xboom speakers, certain water purifier models and a few appliances — can be bought outright with a one-time payment. 0% instalment plans are available through major Malaysian bank credit cards for selected items.",
    bullets: [
      "Selected products only",
      "0% instalment via major banks",
      "Standard LG warranty (not extended)",
    ],
  },
];

const tiers = [
  {
    name: "Self-Service",
    priceHint: "Lowest monthly rate",
    summary:
      "Best for hands-on households comfortable with simple DIY maintenance.",
    inclusions: [
      "Replacement filters and consumables shipped to your door on schedule",
      "Full warranty and repair coverage throughout the term",
      "Phone and WhatsApp priority support",
      "You handle routine cleaning and filter replacement yourself (takes ~1 minute per swap on water purifiers)",
    ],
  },
  {
    name: "Combined Maintenance",
    priceHint: "Middle tier",
    summary:
      "A balanced option — you handle light upkeep and a technician handles the deep clean.",
    inclusions: [
      "Everything in Self-Service",
      "Scheduled technician visits for thorough cleaning and performance checks",
      "Professional filter changes on the regular visit cadence",
    ],
  },
  {
    name: "Regular Visit",
    priceHint: "Highest monthly rate",
    summary:
      "Fully hands-off. LG's care team handles every maintenance task on a fixed cadence.",
    inclusions: [
      "Scheduled technician visits every 3 months",
      "All filter and consumable replacements handled on site",
      "Interior and exterior deep cleaning",
      "Performance inspection and adjustment",
      "Replacement of internal parts subject to wear (e.g. water purifier internal piping) once a year on eligible products",
    ],
  },
];

const whatsIncluded = [
  {
    title: "Free delivery nationwide",
    body: "Doorstep delivery anywhere in Peninsular and East Malaysia — no hidden freight charges.",
  },
  {
    title: "Professional installation",
    body: "A trained technician unpacks, installs and commissions your appliance, and walks you through how it works.",
  },
  {
    title: "Full warranty for the term",
    body: "Your coverage runs for the entire 60 or 84 months — not just the first year.",
  },
  {
    title: "Scheduled maintenance",
    body: "Care tier determines how often a technician visits and how much you handle yourself.",
  },
  {
    title: "Priority support",
    body: "WhatsApp and phone support when things go wrong, with same-day response on working days.",
  },
  {
    title: "No deposit, no upfront cost",
    body: "You only pay the monthly subscription. Your card's credit limit is not blocked.",
  },
];

const faqs = [
  {
    q: "Do I need a credit card to sign up?",
    a: "Yes — a credit or debit card is required for monthly auto-debit. There's no deposit and no upfront lump sum. The card's credit limit is not blocked; only the monthly charge is debited each cycle.",
  },
  {
    q: "What are the eligibility requirements?",
    a: "Malaysian citizens and permanent residents aged 21 and above with a valid IC and proof of address. LG runs a quick eligibility check — you shouldn't currently be blacklisted. Our consultants confirm everything before you sign.",
  },
  {
    q: "What's the difference between the 60 and 84-month plans?",
    a: "Same product, same warranty, same care tier options — but the 84-month plan has a lower monthly rate because the cost is spread over a longer term. The 60-month plan finishes sooner if you prefer a shorter commitment. Not all products offer the 84-month option.",
  },
  {
    q: "Can I buy some products outright instead of subscribing?",
    a: "Yes. Certain products — xboom speakers, some water purifier and dehumidifier models, and a few appliances — can be purchased outright. 0% instalment plans are available through major Malaysian bank credit cards for selected items. Speak to our consultants to check a specific model.",
  },
  {
    q: "What happens at the end of my subscription?",
    a: "The product transfers to you at the end of the contract — LG Subscribe is a rent-to-own arrangement. You can also speak to us about upgrading to a newer LG model early if you'd prefer.",
  },
  {
    q: "Can I cancel early?",
    a: "Yes. You can settle the contract early at any point. Service coverage and warranty remain valid until the original end date of your plan. Specific early-termination conditions vary by plan — our consultants walk you through the details before sign-up.",
  },
  {
    q: "Is installation really free?",
    a: "Standard installation is included for every subscription. For wall-mount TVs, split-system air conditioners or any install requiring custom fabrication, confirm with our consultants during enquiry — some edge cases may carry a small add-on charge.",
  },
  {
    q: "How long does delivery take?",
    a: "Typically 3–14 working days from order confirmation, depending on your location and stock availability. Klang Valley deliveries are often faster.",
  },
];

export default function HowItWorksPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "How It Works", url: "/how-it-works" },
  ];

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      {/* HERO */}
      <section className="bg-lg-mist">
        <div className="container-xl py-24 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">How It Works</div>
            <h1 className="display mt-6 text-balance">
              A premium LG home. On your terms.
            </h1>
            <p className="lede mx-auto mt-8 max-w-2xl text-balance">
              Six simple steps from browsing to the moment a technician walks
              you through your new appliance. Here&apos;s exactly how LG
              Subscribe Malaysia works.
            </p>
          </div>
        </div>
      </section>

      {/* 6-STEP FLOW */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow">The Process</div>
            <h2 className="headline mt-5 text-balance">
              Six steps, typically 1–2 weeks end to end.
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="rounded-[28px] bg-lg-mist p-10">
                <div className="flex items-baseline justify-between">
                  <div className="text-5xl font-semibold tracking-tight text-lg-red">
                    {s.n}
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
                    {s.time}
                  </div>
                </div>
                <div className="mt-8 text-xl font-semibold text-lg-ink">
                  {s.title}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-lg-stone">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLAN STRUCTURE */}
      <section className="section bg-lg-mist">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">Plan Terms</div>
            <h2 className="headline mt-5 text-balance">
              60 months, 84 months, or outright.
            </h2>
            <p className="lede mx-auto mt-6 max-w-2xl text-balance">
              Most LG Subscribe products are offered on a 60-month (5-year) or
              84-month (7-year) term. A few categories are available outright
              only. Pick the option that fits your household.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.label}
                className={`flex flex-col rounded-[28px] p-10 ${
                  p.featured
                    ? "bg-lg-ink text-white"
                    : "bg-white text-lg-ink"
                }`}
              >
                <div
                  className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${
                    p.featured ? "text-lg-red-light" : "text-lg-red"
                  }`}
                >
                  {p.sublabel}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight">
                    {p.label.split(" ")[0]}
                  </span>
                  <span
                    className={`text-base ${
                      p.featured ? "text-white/70" : "text-lg-stone"
                    }`}
                  >
                    {p.label.includes("months") ? "months" : ""}
                  </span>
                </div>
                <div className="mt-6 text-xl font-semibold">
                  {p.headline}
                </div>
                <p
                  className={`mt-3 text-[14px] leading-relaxed ${
                    p.featured ? "text-white/70" : "text-lg-stone"
                  }`}
                >
                  {p.body}
                </p>
                <ul className="mt-8 space-y-3 text-[13px]">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span
                        className={`mt-2 h-1 w-1 flex-none rounded-full ${
                          p.featured ? "bg-lg-red-light" : "bg-lg-red"
                        }`}
                      />
                      <span
                        className={
                          p.featured ? "text-white/80" : "text-lg-stone"
                        }
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARE TIERS */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow">Care Tiers</div>
            <h2 className="headline mt-5 text-balance">
              Choose how hands-on you want to be.
            </h2>
            <p className="lede mt-6 max-w-2xl">
              Every plan includes a care tier that determines how much of the
              maintenance you handle yourself, and how much LG&apos;s
              technicians take care of for you. More care = slightly higher
              monthly rate.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-[28px] bg-lg-mist p-10"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-red">
                  {t.priceHint}
                </div>
                <h3 className="title mt-3">{t.name}</h3>
                <p className="mt-4 text-[14px] leading-relaxed text-lg-stone">
                  {t.summary}
                </p>
                <ul className="mt-8 space-y-3 text-[13px]">
                  {t.inclusions.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-lg-red" />
                      <span className="text-lg-ink">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="section bg-lg-mist">
        <div className="container-xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">What&apos;s Included</div>
            <h2 className="headline mt-5 text-balance">
              Every subscription. No surprises.
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whatsIncluded.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] bg-white p-8"
              >
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
                  {item.title}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-lg-stone">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-xl grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2 className="headline mt-5 text-balance">
              Everything else you need to know.
            </h2>
            <p className="lede mt-6">
              Still unsure? Our consultants handle questions one-on-one on
              WhatsApp — no pressure, no sales script.
            </p>
            <a
              href={whatsappLink(
                "Hi, I have a question about how LG Subscribe works."
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp mt-8"
            >
              Ask on WhatsApp
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
          <div className="relative overflow-hidden rounded-[32px] bg-lg-ink px-10 py-20 text-white sm:px-16 sm:py-24 lg:px-24 lg:py-28">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 80% 30%, #A50034 0%, transparent 55%)",
              }}
            />
            <div className="relative mx-auto max-w-2xl text-center">
              <div className="eyebrow text-lg-red-light">Ready when you are</div>
              <h2 className="headline mt-6 text-balance">
                Let&apos;s find your plan.
              </h2>
              <p className="lede mx-auto mt-6 text-balance text-white/70">
                Chat with us on WhatsApp for a plan recommendation in minutes.
                No credit card required at enquiry.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center rounded-full bg-white px-7 text-[15px] font-medium text-lg-ink hover:bg-white/90"
                >
                  Browse products
                </Link>
                <a
                  href={whatsappLink(
                    "Hi, I'd like a plan recommendation for LG Subscribe."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
