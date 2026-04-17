"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/Toast";

interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  whatsapp: {
    number: string;
    display: string;
  };
  contact: {
    email: string;
    hours: string;
  };
  business: {
    legalName: string;
    streetAddress: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    priceRange: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings(d);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast("Settings saved", "success");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]";

  return (
    <div className="max-w-3xl">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#A50034] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#8a002c] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input type="text" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input type="text" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} rows={2} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input type="text" value={settings.url} onChange={(e) => setSettings({ ...settings, url: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locale</label>
              <input type="text" value={settings.locale} onChange={(e) => setSettings({ ...settings, locale: e.target.value })} className={inputClass} />
            </div>
          </div>
        </section>

        {/* WhatsApp */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
              <input type="text" value={settings.whatsapp.number} onChange={(e) => setSettings({ ...settings, whatsapp: { ...settings.whatsapp, number: e.target.value } })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display</label>
              <input type="text" value={settings.whatsapp.display} onChange={(e) => setSettings({ ...settings, whatsapp: { ...settings.whatsapp, display: e.target.value } })} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.contact.email} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input type="text" value={settings.contact.hours} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, hours: e.target.value } })} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Business */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Legal Name</label>
              <input type="text" value={settings.business.legalName} onChange={(e) => setSettings({ ...settings, business: { ...settings.business, legalName: e.target.value } })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input type="text" value={settings.business.streetAddress} onChange={(e) => setSettings({ ...settings, business: { ...settings.business, streetAddress: e.target.value } })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" value={settings.business.city} onChange={(e) => setSettings({ ...settings, business: { ...settings.business, city: e.target.value } })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <input type="text" value={settings.business.region} onChange={(e) => setSettings({ ...settings, business: { ...settings.business, region: e.target.value } })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input type="text" value={settings.business.postalCode} onChange={(e) => setSettings({ ...settings, business: { ...settings.business, postalCode: e.target.value } })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" value={settings.business.country} onChange={(e) => setSettings({ ...settings, business: { ...settings.business, country: e.target.value } })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <input type="text" value={settings.business.priceRange} onChange={(e) => setSettings({ ...settings, business: { ...settings.business, priceRange: e.target.value } })} className={inputClass} />
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#A50034] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#8a002c] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
