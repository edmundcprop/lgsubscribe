import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/products";
import { posts } from "@/lib/posts";
import { comparisons } from "@/lib/comparisons";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${site.url}/products/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/enquire/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/blog/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/compare/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/how-it-works/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${site.url}/products/${c.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const onlineProducts = products.filter(
    (p) => (p as { status?: string }).status !== "offline"
  );

  const productRoutes: MetadataRoute.Sitemap = onlineProducts.map((p) => ({
    url: `${site.url}/products/${p.category}/${p.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}/`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const compareRoutes: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${site.url}/compare/${c.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...compareRoutes,
  ];
}
