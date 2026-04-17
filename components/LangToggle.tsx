"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "ms";

export default function LangToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored =
      (typeof window !== "undefined" && localStorage.getItem("lang")) || null;
    if (stored === "ms" || stored === "en") {
      setLang(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const toggle = (next: Lang) => {
    setLang(next);
    try {
      localStorage.setItem("lang", next);
    } catch {
      /* ignore quota errors */
    }
    document.documentElement.lang = next;
  };

  return (
    <div
      className="inline-flex items-center rounded-full bg-lg-mist p-0.5 text-[11px] font-semibold"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => toggle("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-3 py-1 transition ${
          lang === "en"
            ? "bg-white text-lg-ink shadow-sm"
            : "text-lg-stone hover:text-lg-ink"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => toggle("ms")}
        aria-pressed={lang === "ms"}
        className={`rounded-full px-3 py-1 transition ${
          lang === "ms"
            ? "bg-white text-lg-ink shadow-sm"
            : "text-lg-stone hover:text-lg-ink"
        }`}
      >
        BM
      </button>
    </div>
  );
}
