"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  products: number;
  posts: number;
  comparisons: number;
  categories: number;
}

const quickLinks = [
  { href: "/admin/products", label: "Manage Products" },
  { href: "/admin/posts", label: "Manage Blog" },
  { href: "/admin/comparisons", label: "Manage Comparisons" },
  { href: "/admin/homepage", label: "Edit Homepage" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/users", label: "Manage Users" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    posts: 0,
    comparisons: 0,
    categories: 0,
  });

  useEffect(() => {
    const safeFetch = (url: string) =>
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(r.statusText);
          return r.json();
        })
        .catch(() => []);

    Promise.all([
      safeFetch("/api/products"),
      safeFetch("/api/posts"),
      safeFetch("/api/comparisons"),
      safeFetch("/api/categories"),
    ]).then(([products, posts, comparisons, categories]) => {
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        posts: Array.isArray(posts) ? posts.length : 0,
        comparisons: Array.isArray(comparisons) ? comparisons.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
      });
    });
  }, []);

  const statCards = [
    { label: "Products", value: stats.products, color: "bg-blue-50 text-blue-700" },
    { label: "Blog Posts", value: stats.posts, color: "bg-green-50 text-green-700" },
    { label: "Comparisons", value: stats.comparisons, color: "bg-purple-50 text-purple-700" },
    { label: "Categories", value: stats.categories, color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#A50034] hover:text-[#A50034] transition-colors"
          >
            {link.label}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
