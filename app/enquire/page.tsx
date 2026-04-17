"use client";

import { useMemo, useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products, type Product } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

type CartItem = {
  id: string;
  productSlug: string;
  productCategory: string;
  productName: string;
  productModel: string | null;
  tenure: "60" | "84" | "outright";
  careTier: string;
  monthlyPrice: number | null;
};

const tenureLabel = (t: CartItem["tenure"]) =>
  t === "60" ? "60 months (5-year)" : t === "84" ? "84 months (7-year)" : "Outright";

function SubscribeForm() {
  const search = useSearchParams();
  const prefillProduct = search.get("product") ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [picker, setPicker] = useState<{
    category: string;
    productSlug: string;
    tenure: "60" | "84" | "outright";
    careTier: string;
  }>({ category: "", productSlug: "", tenure: "60", careTier: "" });

  // Pre-fill cart from ?product=... query
  useEffect(() => {
    if (!prefillProduct) return;
    const match = products.find(
      (p) => p.name === prefillProduct || p.slug === prefillProduct
    );
    if (!match) return;
    const pricing = match.pricing ?? [];
    const firstTier = pricing[0];
    setCart([
      {
        id: crypto.randomUUID(),
        productSlug: match.slug,
        productCategory: match.category,
        productName: match.name,
        productModel: match.model,
        tenure: firstTier ? (String(firstTier.termMonths) as "60" | "84") : match.outright ? "outright" : "60",
        careTier: firstTier?.planName ?? "",
        monthlyPrice: firstTier?.monthly ?? match.price ?? match.outright ?? null,
      },
    ]);
  }, [prefillProduct]);

  const availableProducts: Product[] = useMemo(
    () =>
      picker.category
        ? products.filter((p) => p.category === picker.category)
        : [],
    [picker.category]
  );

  const selectedProduct = useMemo(
    () => products.find((p) => p.slug === picker.productSlug),
    [picker.productSlug]
  );

  // Derive available tenure options from the selected product's pricing
  const availableTenures = useMemo(() => {
    if (!selectedProduct) return [];
    const tenures: { value: "60" | "84" | "outright"; label: string; sub: string }[] = [];
    const pricing = selectedProduct.pricing ?? [];
    const has60 = pricing.some((t) => t.termMonths === 60);
    const has84 = pricing.some((t) => t.termMonths === 84);
    const hasOutright = !!selectedProduct.outright;

    // Also check legacy price/term
    const legacyTerm = selectedProduct.term;
    const show60 = has60 || legacyTerm === 60;
    const show84 = has84 || legacyTerm === 84;

    if (show60) {
      const min60 = pricing.filter((t) => t.termMonths === 60).sort((a, b) => a.monthly - b.monthly)[0];
      tenures.push({
        value: "60",
        label: "60 months",
        sub: min60 ? `From RM${min60.monthly}/mo · ${min60.planName ?? "5-year"}` : "5-year plan",
      });
    }
    if (show84) {
      const min84 = pricing.filter((t) => t.termMonths === 84).sort((a, b) => a.monthly - b.monthly)[0];
      tenures.push({
        value: "84",
        label: "84 months",
        sub: min84 ? `From RM${min84.monthly}/mo · ${min84.planName ?? "7-year"}` : "7-year plan",
      });
    }
    if (hasOutright) {
      tenures.push({
        value: "outright",
        label: "Outright",
        sub: `RM${selectedProduct.outright!.toLocaleString()} one-time`,
      });
    }

    // Fallback if product has no pricing/outright at all
    if (tenures.length === 0) {
      if (selectedProduct.price) {
        tenures.push({
          value: (legacyTerm === 84 ? "84" : "60") as "60" | "84",
          label: legacyTerm === 84 ? "84 months" : "60 months",
          sub: `From RM${selectedProduct.price}/mo`,
        });
      } else {
        tenures.push({ value: "60", label: "Enquire", sub: "Contact us for pricing" });
      }
    }

    return tenures;
  }, [selectedProduct]);

  // Available care tiers for the selected tenure
  const availableCareTiers = useMemo(() => {
    if (!selectedProduct || picker.tenure === "outright") return [];
    const pricing = selectedProduct.pricing ?? [];
    const termMonths = Number(picker.tenure);
    const tiers = pricing
      .filter((t) => t.termMonths === termMonths)
      .sort((a, b) => a.monthly - b.monthly);
    return tiers;
  }, [selectedProduct, picker.tenure]);

  // Auto-select first available tenure when product changes
  useEffect(() => {
    if (availableTenures.length > 0 && !availableTenures.find((t) => t.value === picker.tenure)) {
      setPicker((prev) => ({ ...prev, tenure: availableTenures[0].value, careTier: "" }));
    }
  }, [availableTenures, picker.tenure]);

  // Auto-select first care tier when tenure changes
  useEffect(() => {
    if (availableCareTiers.length > 0) {
      const current = availableCareTiers.find((t) => t.planName === picker.careTier);
      if (!current) {
        setPicker((prev) => ({ ...prev, careTier: availableCareTiers[0].planName ?? "" }));
      }
    } else {
      setPicker((prev) => ({ ...prev, careTier: "" }));
    }
  }, [availableCareTiers, picker.careTier]);

  // Get the monthly price for the current selection
  const currentPrice = useMemo(() => {
    if (!selectedProduct) return null;
    if (picker.tenure === "outright") return selectedProduct.outright ?? null;
    const tier = availableCareTiers.find((t) => t.planName === picker.careTier);
    return tier?.monthly ?? selectedProduct.price ?? null;
  }, [selectedProduct, picker.tenure, picker.careTier, availableCareTiers]);

  const addToCart = () => {
    if (!selectedProduct) return;
    setCart((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        productSlug: selectedProduct.slug,
        productCategory: selectedProduct.category,
        productName: selectedProduct.name,
        productModel: selectedProduct.model,
        tenure: picker.tenure,
        careTier: picker.careTier,
        monthlyPrice: currentPrice,
      },
    ]);
    setPicker({ category: "", productSlug: "", tenure: "60", careTier: "" });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((c) => c.id !== id));

  const updateTenure = (id: string, tenure: CartItem["tenure"]) =>
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, tenure } : c))
    );

  const whatsappHref = useMemo(() => {
    const lines: string[] = [];
    lines.push("Hi LG Subscribe Malaysia,");
    lines.push("");
    lines.push("I'd like to subscribe to the following:");
    lines.push("");

    if (cart.length === 0) {
      lines.push("(no products selected yet)");
    } else {
      cart.forEach((item, i) => {
        let detail = `${i + 1}. ${item.productName}`;
        if (item.productModel) detail += ` (${item.productModel})`;
        detail += ` — ${tenureLabel(item.tenure)}`;
        if (item.careTier) detail += ` · ${item.careTier}`;
        if (item.monthlyPrice) {
          detail += item.tenure === "outright"
            ? ` · RM${item.monthlyPrice.toLocaleString()}`
            : ` · RM${item.monthlyPrice}/mo`;
        }
        lines.push(detail);
      });
    }

    lines.push("");
    lines.push("My details:");
    lines.push(`• Name: ${form.name || "-"}`);
    lines.push(`• Phone: ${form.phone || "-"}`);
    lines.push(`• Email: ${form.email || "-"}`);
    lines.push(`• Location: ${form.location || "-"}`);

    if (form.message.trim()) {
      lines.push("");
      lines.push(`Message: ${form.message}`);
    }

    return whatsappLink(lines.join("\n"));
  }, [cart, form]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Please add at least one product to subscribe.");
      return;
    }
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
      {/* LEFT — intro */}
      <div>
        <div className="eyebrow">Subscribe</div>
        <h1 className="display mt-6 text-balance">Let&apos;s get you set up.</h1>
        <p className="lede mt-8 text-balance">
          Add one or more LG products below, share your contact details, and
          we&apos;ll send your subscription enquiry straight to WhatsApp. Our
          consultants follow up within business hours.
        </p>
        <div className="mt-12 space-y-5 text-[14px]">
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-lg-red/10 text-lg-red">
              📱
            </span>
            <div>
              <div className="font-semibold text-lg-ink">WhatsApp</div>
              <div className="text-lg-stone">{site.whatsapp.display}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-lg-red/10 text-lg-red">
              ✉
            </span>
            <div>
              <div className="font-semibold text-lg-ink">Email</div>
              <div className="text-lg-stone">{site.contact.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-lg-red/10 text-lg-red">
              ⏰
            </span>
            <div>
              <div className="font-semibold text-lg-ink">Hours</div>
              <div className="text-lg-stone">{site.contact.hours}</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <form
        onSubmit={onSubmit}
        className="rounded-[32px] bg-white p-8 shadow-card ring-1 ring-black/[0.04] sm:p-10"
      >
        {/* STEP 1 — products */}
        <div>
          <div className="flex items-baseline justify-between">
            <div className="eyebrow">Step 1</div>
            <div className="text-[11px] font-medium text-lg-stone">
              {cart.length} product{cart.length === 1 ? "" : "s"} added
            </div>
          </div>
          <h2 className="title mt-3">Add products</h2>
          <p className="mt-2 text-[13px] text-lg-stone">
            Choose a category, pick a product, and select your preferred plan
            tenure. You can add multiple products to one subscription enquiry.
          </p>

          {/* Picker */}
          <div className="mt-6 rounded-2xl bg-lg-mist p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select
                  className="input"
                  value={picker.category}
                  onChange={(e) =>
                    setPicker({
                      category: e.target.value,
                      productSlug: "",
                      tenure: picker.tenure,
                      careTier: picker.careTier,
                    })
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Product">
                <select
                  className="input"
                  value={picker.productSlug}
                  onChange={(e) =>
                    setPicker({ ...picker, productSlug: e.target.value })
                  }
                  disabled={!picker.category}
                >
                  <option value="">
                    {picker.category
                      ? "Select a product"
                      : "Pick a category first"}
                  </option>
                  {availableProducts.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Tenure — dynamic based on selected product */}
            <div className="mt-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
                {selectedProduct ? "Available plans" : "Preferred tenure"}
              </div>
              {!selectedProduct ? (
                <p className="text-[12px] text-lg-stone italic">
                  Select a product above to see available plans and pricing.
                </p>
              ) : availableTenures.length === 0 ? (
                <p className="text-[12px] text-lg-stone italic">
                  No plans available. Contact us on WhatsApp for pricing.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-3">
                  {availableTenures.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-xl border px-4 py-3 text-[13px] transition ${
                        picker.tenure === opt.value
                          ? "border-lg-red bg-lg-red/5"
                          : "border-black/10 bg-white hover:border-black/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="picker-tenure"
                        value={opt.value}
                        checked={picker.tenure === opt.value}
                        onChange={() =>
                          setPicker({ ...picker, tenure: opt.value })
                        }
                        className="sr-only"
                      />
                      <div className="font-semibold text-lg-ink">
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-lg-stone">{opt.sub}</div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Care Tier — only for subscription (not outright) */}
            {selectedProduct && picker.tenure !== "outright" && availableCareTiers.length > 1 && (
              <div className="mt-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
                  Care tier
                </div>
                <div className="space-y-2">
                  {availableCareTiers.map((tier) => (
                    <label
                      key={tier.planName}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-[13px] transition ${
                        picker.careTier === tier.planName
                          ? "border-lg-red bg-lg-red/5"
                          : "border-black/10 bg-white hover:border-black/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="picker-care"
                          value={tier.planName}
                          checked={picker.careTier === tier.planName}
                          onChange={() =>
                            setPicker({ ...picker, careTier: tier.planName ?? "" })
                          }
                          className="sr-only"
                        />
                        <div>
                          <div className="font-semibold text-lg-ink">
                            {tier.planName}
                          </div>
                          {tier.note && (
                            <div className="text-[11px] text-lg-stone">
                              {tier.note}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg-ink">
                          RM{tier.monthly}/mo
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price summary before adding */}
            {selectedProduct && currentPrice && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[13px]">
                <span className="text-lg-stone">
                  {picker.tenure === "outright" ? "Total" : "Monthly"}
                </span>
                <span className="text-lg font-semibold text-lg-ink">
                  RM{currentPrice.toLocaleString()}
                  {picker.tenure !== "outright" && (
                    <span className="text-[13px] font-normal text-lg-stone">/mo</span>
                  )}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={addToCart}
              disabled={!selectedProduct}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-lg-ink text-[14px] font-medium text-white transition hover:bg-lg-graphite disabled:cursor-not-allowed disabled:bg-lg-ink/30"
            >
              + Add to subscription
            </button>
          </div>

          {/* Cart list */}
          {cart.length > 0 && (
            <ul className="mt-6 space-y-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
                        {item.productModel ?? "LG"}
                      </div>
                      <div className="mt-1 text-[14px] font-semibold text-lg-ink">
                        {item.productName}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          item.tenure === "84"
                            ? "bg-[#A50034] text-white"
                            : item.tenure === "60"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}>
                          {tenureLabel(item.tenure)}
                        </span>
                        {item.careTier && (
                          <span className="inline-flex rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-lg-stone">
                            {item.careTier}
                          </span>
                        )}
                      </div>
                      {item.monthlyPrice && (
                        <div className="mt-2 text-[14px] font-semibold text-lg-ink">
                          RM{item.monthlyPrice.toLocaleString()}
                          {item.tenure !== "outright" && (
                            <span className="text-[12px] font-normal text-lg-stone">/mo</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.productName}`}
                      className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-lg-stone hover:bg-lg-mist hover:text-lg-red"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="my-10 border-t border-black/[0.06]" />

        {/* STEP 2 — contact */}
        <div>
          <div className="eyebrow">Step 2</div>
          <h2 className="title mt-3">Your details</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                required
                name="name"
                value={form.name}
                onChange={onChange}
                className="input"
                placeholder="Ahmad bin Ismail"
              />
            </Field>
            <Field label="Phone" required>
              <input
                required
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="input"
                placeholder="012-345 6789"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="input"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Location">
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                className="input"
                placeholder="Kuala Lumpur"
              />
            </Field>
            <Field label="Message" className="sm:col-span-2">
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={4}
                className="input"
                placeholder="Anything else — delivery preferences, questions, renovation timing, etc."
              />
            </Field>
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-8 rounded-2xl bg-lg-mist p-5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-lg-stone">
                {cart.length} product{cart.length !== 1 ? "s" : ""} selected
              </span>
              <span className="text-lg font-semibold text-lg-ink">
                {(() => {
                  const monthlyItems = cart.filter((c) => c.tenure !== "outright" && c.monthlyPrice);
                  const outrightItems = cart.filter((c) => c.tenure === "outright" && c.monthlyPrice);
                  const monthlyTotal = monthlyItems.reduce((s, c) => s + (c.monthlyPrice ?? 0), 0);
                  const outrightTotal = outrightItems.reduce((s, c) => s + (c.monthlyPrice ?? 0), 0);
                  const parts: string[] = [];
                  if (monthlyTotal > 0) parts.push(`RM${monthlyTotal.toLocaleString()}/mo`);
                  if (outrightTotal > 0) parts.push(`RM${outrightTotal.toLocaleString()} outright`);
                  return parts.length > 0 ? parts.join(" + ") : "Enquire for pricing";
                })()}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-whatsapp mt-6 h-12 w-full sm:w-auto"
        >
          Send subscription via WhatsApp
        </button>
        <p className="mt-4 text-[12px] text-lg-stone">
          Clicking the button opens WhatsApp in a new tab with your
          subscription details pre-filled to {site.whatsapp.display}. No data
          is stored on this website.
        </p>
        <p className="mt-2 text-[11px] text-lg-stone/70">
          By submitting, you consent to LG Subscribe Malaysia contacting you
          via WhatsApp regarding your subscription. Your personal data is used
          solely for this enquiry and is not shared with third parties. This
          site is operated by an authorised LG Subscribe reseller in Malaysia.
        </p>

        <style jsx>{`
          .input {
            width: 100%;
            border-radius: 12px;
            border: 1px solid rgba(0, 0, 0, 0.12);
            padding: 12px 14px;
            font-size: 14px;
            background: #fff;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .input:focus {
            outline: none;
            border-color: #a50034;
            box-shadow: 0 0 0 3px rgba(165, 0, 52, 0.15);
          }
          .input:disabled {
            background: #f5f5f7;
            color: #86868b;
          }
        `}</style>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-stone">
        {label}
        {required && <span className="ml-1 text-lg-red">*</span>}
      </span>
      {children}
    </label>
  );
}

export default function SubscribePage() {
  return (
    <section className="section-sm bg-white">
      <div className="container-xl">
        <Suspense fallback={<div className="text-lg-stone">Loading…</div>}>
          <SubscribeForm />
        </Suspense>
      </div>
    </section>
  );
}
