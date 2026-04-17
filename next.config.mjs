import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: "export" to support API routes for the CMS admin.
  // Netlify handles SSR via their Next.js adapter.
  // For static-only hosting, add output: "export" back and remove /api + /admin routes.
  images: { unoptimized: true },
  trailingSlash: true,
  outputFileTracingRoot: path.resolve("."),
};

export default nextConfig;
