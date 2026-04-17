"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/products";
import LangToggle from "@/components/LangToggle";
import T from "@/components/T";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-white/80 backdrop-blur-xl">
      <div className="container-xl flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="LG Subscribe Malaysia"
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <Link href="/products" className="nav-link">
              <T en="Store" ms="Kedai" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/95 p-3 shadow-card-hover ring-1 ring-black/5 backdrop-blur-xl">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products/${c.slug}`}
                    className="rounded-xl px-4 py-3 transition hover:bg-lg-mist"
                  >
                    <div className="text-[13px] font-semibold text-lg-ink">
                      {c.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-lg-stone">
                      {c.short}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/products" className="nav-link">
            <T en="All Products" ms="Semua Produk" />
          </Link>
          <Link href="/blog" className="nav-link">
            <T en="Blog" ms="Blog" />
          </Link>
          <Link href="/how-it-works" className="nav-link">
            <T en="How It Works" ms="Cara Kerjanya" />
          </Link>
          <Link href="/#faq" className="nav-link">
            <T en="Support" ms="Sokongan" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle />
          <Link
            href="/enquire"
            className="inline-flex h-9 items-center rounded-full bg-lg-red px-5 text-[13px] font-medium text-white transition hover:bg-lg-red-dark"
          >
            <T en="Subscribe" ms="Langgan" />
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-lg-mist lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-lg-ink"
            >
              {mobileOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-black/[0.04] bg-white lg:hidden">
          <div className="container-xl flex flex-col gap-1 py-4">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-[15px] font-medium text-lg-ink transition hover:bg-lg-mist"
            >
              <T en="Store" ms="Kedai" />
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-[15px] font-medium text-lg-ink transition hover:bg-lg-mist"
            >
              <T en="All Products" ms="Semua Produk" />
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-[15px] font-medium text-lg-ink transition hover:bg-lg-mist"
            >
              <T en="Blog" ms="Blog" />
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-[15px] font-medium text-lg-ink transition hover:bg-lg-mist"
            >
              <T en="How It Works" ms="Cara Kerjanya" />
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-[15px] font-medium text-lg-ink transition hover:bg-lg-mist"
            >
              <T en="Support" ms="Sokongan" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
