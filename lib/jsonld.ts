import { site, absoluteUrl } from "./site";
import type { Product } from "./products";

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/logo.png`,
  sameAs: [] as string[],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: `+${site.whatsapp.number}`,
      contactType: "customer support",
      areaServed: "MY",
      availableLanguage: ["en", "ms"],
    },
  ],
});

export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#localbusiness`,
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: `+${site.whatsapp.number}`,
  priceRange: site.business.priceRange,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.business.city,
    addressRegion: site.business.region,
    postalCode: site.business.postalCode,
    addressCountry: site.business.country,
  },
  areaServed: {
    "@type": "Country",
    name: "Malaysia",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
});

export const breadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.url),
  })),
});

export const productSchema = (product: Product, categoryName: string) => {
  const url = absoluteUrl(`/products/${product.category}/${product.slug}`);
  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const minPrice = product.pricing?.length
    ? Math.min(...product.pricing.map((p) => p.monthly))
    : product.price ?? undefined;

  const offers = minPrice
    ? {
        "@type": "Offer",
        url,
        priceCurrency: "MYR",
        price: String(minPrice),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(minPrice),
          priceCurrency: "MYR",
          unitText: "MONTH",
        },
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: site.name,
        },
      }
    : product.outright
      ? {
          "@type": "Offer",
          url,
          priceCurrency: "MYR",
          price: String(product.outright),
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: site.name,
          },
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    image: images,
    sku: product.model ?? product.slug,
    mpn: product.model ?? undefined,
    brand: {
      "@type": "Brand",
      name: "LG",
    },
    category: categoryName,
    ...(offers ? { offers } : {}),
  };
};

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
});

export const articleSchema = (post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  image: post.image ? [post.image] : undefined,
  datePublished: post.date,
  dateModified: post.date,
  author: {
    "@type": "Organization",
    name: site.name,
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/logo.png`,
    },
  },
  mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
});

