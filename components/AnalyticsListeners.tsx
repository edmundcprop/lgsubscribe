"use client";

import { useEffect } from "react";
import { pushEvent } from "@/lib/analytics";

// Delegated click tracking for WhatsApp links and Enquire CTAs.
// Mounted once in the root layout — fires on any descendant <a> click,
// including links rendered in server components.
export default function AnalyticsListeners() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const label = (anchor.textContent ?? "").trim().slice(0, 80);

      if (href.startsWith("https://wa.me/") || href.includes("api.whatsapp.com")) {
        pushEvent({
          event: "whatsapp_click",
          link_url: href,
          link_text: label,
          link_location: anchor.getAttribute("aria-label") ?? "link",
        });
        return;
      }

      if (href === "/enquire" || href.startsWith("/enquire?") || href.startsWith("/enquire#")) {
        pushEvent({
          event: "enquire_click",
          link_url: href,
          link_text: label,
        });
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
