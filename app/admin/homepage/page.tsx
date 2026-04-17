"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/Toast";
import DynamicList from "@/components/admin/DynamicList";
import ImageUpload from "@/components/admin/ImageUpload";

interface ValueProp {
  titleEn: string;
  titleMs: string;
  bodyEn: string;
  bodyMs: string;
}

interface Testimonial {
  quote: string;
  name: string;
  location: string;
  products: string;
}

interface Scenario {
  labelEn: string;
  labelMs: string;
  titleEn: string;
  titleMs: string;
  bodyEn: string;
  bodyMs: string;
  image: string;
}

interface Step {
  n: string;
  title: string;
  body: string;
}

interface FAQ {
  q: string;
  a: string;
}

interface HomepageData {
  valueProps: ValueProp[];
  testimonials: Testimonial[];
  scenarios: Scenario[];
  steps: Step[];
  faqs: FAQ[];
  featuredSlugs: string[];
}

export default function HomepagePage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast("Homepage updated", "success");
      } else {
        showToast("Failed to save", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-4xl">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#A50034] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#8a002c] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Value Props */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Value Props</h2>
          <div className="space-y-4">
            {data.valueProps.map((vp, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Prop {i + 1}</span>
                  <button
                    onClick={() =>
                      setData({ ...data, valueProps: data.valueProps.filter((_, j) => j !== i) })
                    }
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={vp.titleEn} onChange={(e) => { const v = [...data.valueProps]; v[i] = { ...v[i], titleEn: e.target.value }; setData({ ...data, valueProps: v }); }} placeholder="Title (EN)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <input type="text" value={vp.titleMs} onChange={(e) => { const v = [...data.valueProps]; v[i] = { ...v[i], titleMs: e.target.value }; setData({ ...data, valueProps: v }); }} placeholder="Title (MS)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <input type="text" value={vp.bodyEn} onChange={(e) => { const v = [...data.valueProps]; v[i] = { ...v[i], bodyEn: e.target.value }; setData({ ...data, valueProps: v }); }} placeholder="Body (EN)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <input type="text" value={vp.bodyMs} onChange={(e) => { const v = [...data.valueProps]; v[i] = { ...v[i], bodyMs: e.target.value }; setData({ ...data, valueProps: v }); }} placeholder="Body (MS)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setData({
                  ...data,
                  valueProps: [...data.valueProps, { titleEn: "", titleMs: "", bodyEn: "", bodyMs: "" }],
                })
              }
              className="text-sm text-[#A50034] font-medium"
            >
              + Add value prop
            </button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Testimonials</h2>
          <div className="space-y-4">
            {data.testimonials.map((t, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Testimonial {i + 1}</span>
                  <button
                    onClick={() =>
                      setData({ ...data, testimonials: data.testimonials.filter((_, j) => j !== i) })
                    }
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <textarea value={t.quote} onChange={(e) => { const v = [...data.testimonials]; v[i] = { ...v[i], quote: e.target.value }; setData({ ...data, testimonials: v }); }} placeholder="Quote" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={t.name} onChange={(e) => { const v = [...data.testimonials]; v[i] = { ...v[i], name: e.target.value }; setData({ ...data, testimonials: v }); }} placeholder="Name" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <input type="text" value={t.location} onChange={(e) => { const v = [...data.testimonials]; v[i] = { ...v[i], location: e.target.value }; setData({ ...data, testimonials: v }); }} placeholder="Location" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <input type="text" value={t.products} onChange={(e) => { const v = [...data.testimonials]; v[i] = { ...v[i], products: e.target.value }; setData({ ...data, testimonials: v }); }} placeholder="Products" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setData({
                  ...data,
                  testimonials: [...data.testimonials, { quote: "", name: "", location: "", products: "" }],
                })
              }
              className="text-sm text-[#A50034] font-medium"
            >
              + Add testimonial
            </button>
          </div>
        </section>

        {/* Scenarios */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scenarios</h2>
          <div className="space-y-4">
            {data.scenarios.map((s, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Scenario {i + 1}</span>
                  <button
                    onClick={() =>
                      setData({ ...data, scenarios: data.scenarios.filter((_, j) => j !== i) })
                    }
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={s.labelEn} onChange={(e) => { const v = [...data.scenarios]; v[i] = { ...v[i], labelEn: e.target.value }; setData({ ...data, scenarios: v }); }} placeholder="Label (EN)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <input type="text" value={s.labelMs} onChange={(e) => { const v = [...data.scenarios]; v[i] = { ...v[i], labelMs: e.target.value }; setData({ ...data, scenarios: v }); }} placeholder="Label (MS)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <input type="text" value={s.titleEn} onChange={(e) => { const v = [...data.scenarios]; v[i] = { ...v[i], titleEn: e.target.value }; setData({ ...data, scenarios: v }); }} placeholder="Title (EN)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <input type="text" value={s.titleMs} onChange={(e) => { const v = [...data.scenarios]; v[i] = { ...v[i], titleMs: e.target.value }; setData({ ...data, scenarios: v }); }} placeholder="Title (MS)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <textarea value={s.bodyEn} onChange={(e) => { const v = [...data.scenarios]; v[i] = { ...v[i], bodyEn: e.target.value }; setData({ ...data, scenarios: v }); }} placeholder="Body (EN)" rows={2} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                  <textarea value={s.bodyMs} onChange={(e) => { const v = [...data.scenarios]; v[i] = { ...v[i], bodyMs: e.target.value }; setData({ ...data, scenarios: v }); }} placeholder="Body (MS)" rows={2} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                </div>
                <ImageUpload value={s.image} onChange={(url) => { const v = [...data.scenarios]; v[i] = { ...v[i], image: url }; setData({ ...data, scenarios: v }); }} placeholder="Scenario image URL or upload" />
              </div>
            ))}
            <button
              onClick={() =>
                setData({
                  ...data,
                  scenarios: [...data.scenarios, { labelEn: "", labelMs: "", titleEn: "", titleMs: "", bodyEn: "", bodyMs: "", image: "" }],
                })
              }
              className="text-sm text-[#A50034] font-medium"
            >
              + Add scenario
            </button>
          </div>
        </section>

        {/* Steps */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Steps</h2>
          <div className="space-y-3">
            {data.steps.map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <input type="text" value={s.n} onChange={(e) => { const v = [...data.steps]; v[i] = { ...v[i], n: e.target.value }; setData({ ...data, steps: v }); }} placeholder="#" className="w-16 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                <input type="text" value={s.title} onChange={(e) => { const v = [...data.steps]; v[i] = { ...v[i], title: e.target.value }; setData({ ...data, steps: v }); }} placeholder="Title" className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                <input type="text" value={s.body} onChange={(e) => { const v = [...data.steps]; v[i] = { ...v[i], body: e.target.value }; setData({ ...data, steps: v }); }} placeholder="Body" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                <button
                  onClick={() =>
                    setData({ ...data, steps: data.steps.filter((_, j) => j !== i) })
                  }
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-gray-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setData({
                  ...data,
                  steps: [...data.steps, { n: String(data.steps.length + 1).padStart(2, "0"), title: "", body: "" }],
                })
              }
              className="text-sm text-[#A50034] font-medium"
            >
              + Add step
            </button>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">FAQs</h2>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">FAQ {i + 1}</span>
                  <button
                    onClick={() =>
                      setData({ ...data, faqs: data.faqs.filter((_, j) => j !== i) })
                    }
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <input type="text" value={faq.q} onChange={(e) => { const v = [...data.faqs]; v[i] = { ...v[i], q: e.target.value }; setData({ ...data, faqs: v }); }} placeholder="Question" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
                <textarea value={faq.a} onChange={(e) => { const v = [...data.faqs]; v[i] = { ...v[i], a: e.target.value }; setData({ ...data, faqs: v }); }} placeholder="Answer" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]" />
              </div>
            ))}
            <button
              onClick={() =>
                setData({ ...data, faqs: [...data.faqs, { q: "", a: "" }] })
              }
              className="text-sm text-[#A50034] font-medium"
            >
              + Add FAQ
            </button>
          </div>
        </section>

        {/* Featured Product Slugs */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Product Slugs</h2>
          <DynamicList
            items={data.featuredSlugs}
            onChange={(v) => setData({ ...data, featuredSlugs: v })}
            placeholder="product-slug"
          />
        </section>

        {/* Bottom save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#A50034] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#8a002c] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
