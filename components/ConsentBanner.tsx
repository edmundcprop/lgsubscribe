"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "lg-consent-v1";

type ConsentChoice = "granted" | "denied";

type ConsentRecord = {
  analytics_storage: ConsentChoice;
  ad_storage: ConsentChoice;
  ad_user_data: ConsentChoice;
  ad_personalization: ConsentChoice;
  decided_at: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function applyConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  const payload = {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  } as const;
  // gtag is defined inline in the layout's default-consent script.
  window.gtag?.("consent", "update", payload);
  const record: ConsentRecord = { ...payload, decided_at: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage unavailable (private mode etc.) — choice still applies for this session.
  }
}

function readStoredChoice(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.analytics_storage === "granted" || parsed.analytics_storage === "denied") {
      return parsed.analytics_storage;
    }
    return null;
  } catch {
    return null;
  }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readStoredChoice();
    if (stored === "granted") {
      // Re-apply on every page load so the GTM container running in this session
      // gets the user's prior decision after default-denied.
      applyConsent("granted");
      return;
    }
    if (stored === "denied") {
      return;
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    applyConsent("granted");
    setVisible(false);
  };

  const reject = () => {
    applyConsent("denied");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl bg-lg-ink text-white shadow-card-hover ring-1 ring-white/10 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:left-6"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex-1 text-[13px] leading-relaxed text-white/85">
          <div className="text-[14px] font-semibold text-white">We use cookies</div>
          <p className="mt-1">
            We use analytics and marketing cookies to understand how visitors use this
            site and to improve it. Choose &ldquo;Accept&rdquo; to allow these, or
            &ldquo;Reject&rdquo; to decline. You can change your choice anytime by
            clearing your browser data.
          </p>
        </div>
        <div className="flex flex-none flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={reject}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/30 px-5 text-[13px] font-medium text-white transition hover:bg-white/10"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-lg-ink transition hover:bg-white/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
