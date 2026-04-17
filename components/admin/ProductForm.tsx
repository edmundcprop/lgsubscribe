"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DynamicList from "@/components/admin/DynamicList";
import DynamicKeyValue from "@/components/admin/DynamicKeyValue";
import ImageUpload, { GalleryUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";

interface PricingTier {
  monthly: number;
  termMonths: number;
  planName: string;
  note: string;
}

interface Section {
  heading: string;
  body: string;
  image: string;
  caption: string;
}

interface FAQ {
  q: string;
  a: string;
}

type ProductStatus = "online" | "offline" | "draft";

interface ProductData {
  slug: string;
  name: string;
  model: string;
  category: string;
  tagline: string;
  price: number;
  term: number;
  outrightPrice?: number;
  image: string;
  gallery: string[];
  features: string[];
  pricing: PricingTier[];
  specs: { label: string; value: string }[];
  sections: Section[];
  whatsInBox: string[];
  warranty: string;
  faqs: FAQ[];
  heroDescription: string;
  status: ProductStatus;
}

const emptyProduct: ProductData = {
  slug: "",
  name: "",
  model: "",
  category: "",
  tagline: "",
  price: 0,
  term: 60,
  outrightPrice: 0,
  image: "",
  gallery: [],
  features: [],
  pricing: [],
  specs: [],
  sections: [],
  whatsInBox: [],
  warranty: "",
  faqs: [],
  heroDescription: "",
  status: "draft",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductForm({
  initialData,
  isEdit = false,
}: {
  initialData?: ProductData;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [form, setForm] = useState<ProductData>(initialData || emptyProduct);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats) => setCategories(Array.isArray(cats) ? cats : []));
  }, []);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const set = <K extends keyof ProductData>(key: K, val: ProductData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "name" && !isEdit) {
        next.slug = slugify(val as string);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = isEdit ? `/api/products/${form.slug}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(isEdit ? "Product updated" : "Product created", "success");
        if (!isEdit) {
          setTimeout(() => router.push("/admin/products"), 1000);
        }
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to save product", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const res = await fetch(`/api/products/${form.slug}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Product deleted", "success");
      setTimeout(() => router.push("/admin/products"), 1000);
    } else {
      showToast("Failed to delete", "error");
    }
  };

  const statusConfig: Record<
    ProductStatus,
    { label: string; color: string; bg: string; dot: string }
  > = {
    online: {
      label: "Live",
      color: "text-green-700",
      bg: "bg-green-50 border-green-200",
      dot: "bg-green-500",
    },
    draft: {
      label: "Draft",
      color: "text-yellow-700",
      bg: "bg-yellow-50 border-yellow-200",
      dot: "bg-yellow-500",
    },
    offline: {
      label: "Offline",
      color: "text-red-700",
      bg: "bg-red-50 border-red-200",
      dot: "bg-red-500",
    },
  };

  const currentStatus = statusConfig[form.status] || statusConfig.draft;
  const previewUrl = form.category && form.slug
    ? `/products/${form.category}/${form.slug}`
    : null;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <ToastContainer />

      {/* Status Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 ${currentStatus.bg}`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-3 w-3 rounded-full ${currentStatus.dot}`}
          />
          <span className={`text-sm font-semibold ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
          <span className="text-xs text-gray-500">
            {form.status === "online"
              ? "This product is visible on the public site."
              : form.status === "draft"
              ? "This product is hidden from the public site."
              : "This product has been taken offline."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Status toggle buttons */}
          {form.status !== "online" && (
            <button
              type="button"
              onClick={() => set("status", "online")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Publish
            </button>
          )}
          {form.status === "online" && (
            <button
              type="button"
              onClick={() => set("status", "offline")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Take Offline
            </button>
          )}
          {form.status !== "draft" && (
            <button
              type="button"
              onClick={() => set("status", "draft")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Move to Draft
            </button>
          )}
          {/* Preview button */}
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </a>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">
          Basic Info
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              required
              readOnly={isEdit}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Price (RM/month)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Shown as &quot;From RMx/mo&quot; on product cards. Usually the lowest pricing tier.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Term (months)
            </label>
            <select
              value={form.term}
              onChange={(e) => set("term", Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            >
              <option value={60}>60 months (5 years)</option>
              <option value={84}>84 months (7 years)</option>
              <option value={0}>Outright only</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              The term shown with the card price. Detailed tiers go in Pricing & Plans below.
            </p>
          </div>
        </div>
      </fieldset>

      {/* Images */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">Images</legend>
        <div className="space-y-6 mt-4">
          <ImageUpload
            label="Main Product Image"
            value={form.image}
            onChange={(url) => set("image", url)}
            placeholder="Paste URL or click Upload"
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Gallery Images
            </label>
            <p className="mb-3 text-xs text-gray-400">
              Add multiple images via URL or upload. These appear as thumbnails on the product detail page.
            </p>
            <GalleryUpload
              items={form.gallery}
              onChange={(urls) => set("gallery", urls)}
            />
          </div>
        </div>
      </fieldset>

      {/* Features */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">Features</legend>
        <div className="mt-4">
          <DynamicList
            items={form.features}
            onChange={(v) => set("features", v)}
            placeholder="Feature description"
          />
        </div>
      </fieldset>

      {/* Pricing & Plans */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">
          Pricing & Plans
        </legend>
        <p className="mt-2 text-xs text-gray-500">
          Add subscription tiers with term length and care level. The lowest monthly price auto-populates the card &quot;From&quot; price.
          Different products support different combinations — add only the ones available for this product.
        </p>

        {/* Quick-add presets */}
        <div className="mt-4 mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Quick add a tier
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { term: 60, care: "Self-Service", label: "5yr Self-Service" },
              { term: 60, care: "Combined Maintenance", label: "5yr Combined" },
              { term: 60, care: "Regular Visit", label: "5yr Regular Visit" },
              { term: 84, care: "Self-Service", label: "7yr Self-Service" },
              { term: 84, care: "Combined Maintenance", label: "7yr Combined" },
              { term: 84, care: "Regular Visit", label: "7yr Regular Visit" },
            ].map((preset) => {
              const exists = form.pricing.some(
                (t) => t.termMonths === preset.term && t.planName === preset.care
              );
              return (
                <button
                  key={preset.label}
                  type="button"
                  disabled={exists}
                  onClick={() =>
                    set("pricing", [
                      ...form.pricing,
                      {
                        monthly: 0,
                        termMonths: preset.term,
                        planName: preset.care,
                        note: "",
                      },
                    ])
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    exists
                      ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-600 hover:border-[#A50034] hover:text-[#A50034]"
                  }`}
                >
                  + {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier list */}
        <div className="space-y-3">
          {form.pricing.length === 0 && (
            <p className="text-sm text-gray-400 italic py-4 text-center">
              No pricing tiers yet. Use the buttons above to add plans, or add a custom tier below.
            </p>
          )}
          {form.pricing.map((tier, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      tier.termMonths === 84
                        ? "bg-[#A50034] text-white"
                        : tier.termMonths === 60
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tier.termMonths === 60
                      ? "5-Year"
                      : tier.termMonths === 84
                      ? "7-Year"
                      : `${tier.termMonths}mo`}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {tier.planName || "Custom Plan"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "pricing",
                      form.pricing.filter((_, j) => j !== i)
                    )
                  }
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Monthly (RM)
                  </label>
                  <input
                    type="number"
                    value={tier.monthly || ""}
                    onChange={(e) => {
                      const next = [...form.pricing];
                      next[i] = { ...next[i], monthly: Number(e.target.value) };
                      set("pricing", next);
                    }}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Term
                  </label>
                  <select
                    value={tier.termMonths}
                    onChange={(e) => {
                      const next = [...form.pricing];
                      next[i] = {
                        ...next[i],
                        termMonths: Number(e.target.value),
                      };
                      set("pricing", next);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                  >
                    <option value={60}>60 months (5 years)</option>
                    <option value={84}>84 months (7 years)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Care Tier
                  </label>
                  <select
                    value={tier.planName}
                    onChange={(e) => {
                      const next = [...form.pricing];
                      next[i] = { ...next[i], planName: e.target.value };
                      set("pricing", next);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                  >
                    <option value="Self-Service">Self-Service</option>
                    <option value="Combined Maintenance">
                      Combined Maintenance
                    </option>
                    <option value="Regular Visit">Regular Visit</option>
                    <option value="LG Subscribe">LG Subscribe (generic)</option>
                    <option value="">Custom...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={tier.note}
                    onChange={(e) => {
                      const next = [...form.pricing];
                      next[i] = { ...next[i], note: e.target.value };
                      set("pricing", next);
                    }}
                    placeholder="e.g. Includes free installation"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom tier add */}
        <button
          type="button"
          onClick={() =>
            set("pricing", [
              ...form.pricing,
              { monthly: 0, termMonths: 60, planName: "", note: "" },
            ])
          }
          className="mt-3 text-sm text-gray-500 hover:text-[#A50034] font-medium"
        >
          + Add custom tier
        </button>

        {/* Outright price */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Outright Purchase Price (RM, optional)
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Leave 0 or empty if this product is subscription-only.
          </p>
          <input
            type="number"
            value={form.outrightPrice || ""}
            onChange={(e) =>
              set("outrightPrice", Number(e.target.value) || 0)
            }
            placeholder="e.g. 3200"
            className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
          />
        </div>
      </fieldset>

      {/* Specs */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">Specs</legend>
        <div className="mt-4">
          <DynamicKeyValue
            items={form.specs}
            onChange={(v) => set("specs", v)}
          />
        </div>
      </fieldset>

      {/* Sections */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">Sections</legend>
        <div className="space-y-4 mt-4">
          {form.sections.map((section, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Section {i + 1}</span>
                <button
                  type="button"
                  onClick={() => set("sections", form.sections.filter((_, j) => j !== i))}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={section.heading}
                onChange={(e) => {
                  const next = [...form.sections];
                  next[i] = { ...next[i], heading: e.target.value };
                  set("sections", next);
                }}
                placeholder="Heading"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
              />
              <textarea
                value={section.body}
                onChange={(e) => {
                  const next = [...form.sections];
                  next[i] = { ...next[i], body: e.target.value };
                  set("sections", next);
                }}
                placeholder="Body"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
              />
              <ImageUpload
                value={section.image}
                onChange={(url) => {
                  const next = [...form.sections];
                  next[i] = { ...next[i], image: url };
                  set("sections", next);
                }}
                placeholder="Section image URL or upload"
              />
              <input
                type="text"
                value={section.caption || ""}
                onChange={(e) => {
                  const next = [...form.sections];
                  next[i] = { ...next[i], caption: e.target.value };
                  set("sections", next);
                }}
                placeholder="Caption (optional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              set("sections", [
                ...form.sections,
                { heading: "", body: "", image: "", caption: "" },
              ])
            }
            className="text-sm text-[#A50034] hover:text-[#A50034]/80 font-medium"
          >
            + Add section
          </button>
        </div>
      </fieldset>

      {/* What's in Box */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">{"What's in the Box"}</legend>
        <div className="mt-4">
          <DynamicList
            items={form.whatsInBox}
            onChange={(v) => set("whatsInBox", v)}
            placeholder="Item in box"
          />
        </div>
      </fieldset>

      {/* Warranty */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">Warranty</legend>
        <div className="mt-4">
          <textarea
            value={form.warranty}
            onChange={(e) => set("warranty", e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
          />
        </div>
      </fieldset>

      {/* FAQs */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">FAQs</legend>
        <div className="space-y-3 mt-4">
          {form.faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">FAQ {i + 1}</span>
                <button
                  type="button"
                  onClick={() => set("faqs", form.faqs.filter((_, j) => j !== i))}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={faq.q}
                onChange={(e) => {
                  const next = [...form.faqs];
                  next[i] = { ...next[i], q: e.target.value };
                  set("faqs", next);
                }}
                placeholder="Question"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
              />
              <textarea
                value={faq.a}
                onChange={(e) => {
                  const next = [...form.faqs];
                  next[i] = { ...next[i], a: e.target.value };
                  set("faqs", next);
                }}
                placeholder="Answer"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("faqs", [...form.faqs, { q: "", a: "" }])}
            className="text-sm text-[#A50034] hover:text-[#A50034]/80 font-medium"
          >
            + Add FAQ
          </button>
        </div>
      </fieldset>

      {/* Hero Description */}
      <fieldset className="bg-white border border-gray-200 rounded-xl p-6">
        <legend className="text-lg font-semibold text-gray-900 px-1">Hero Description</legend>
        <div className="mt-4">
          <textarea
            value={form.heroDescription}
            onChange={(e) => set("heroDescription", e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
          />
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#A50034] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#8a002c] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto px-6 py-2.5 rounded-lg text-sm font-medium text-red-600 border border-red-300 hover:bg-red-50"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
