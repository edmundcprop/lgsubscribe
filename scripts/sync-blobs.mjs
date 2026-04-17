// Runs before `next build`. If we're in a Netlify build, pull each CMS
// dataset from Netlify Blobs and overwrite the committed data/*.json so
// SSG picks up admin edits. Outside Netlify, do nothing.
//
// This is best-effort: any failure is logged and swallowed. The build
// must never fail because of blob sync — in the worst case we fall back
// to the committed JSON, which is the same behaviour as before Blobs.

import fs from "node:fs";
import path from "node:path";

if (process.env.NETLIFY !== "true") {
  console.log("[sync-blobs] not on Netlify, skipping");
  process.exit(0);
}

const keys = [
  "posts",
  "products",
  "comparisons",
  "categories",
  "homepage",
  "site",
  "users",
];

let store;
try {
  const mod = await import("@netlify/blobs");
  // Try explicit construction first (works in build scripts when Netlify
  // injects SITE_ID + NETLIFY_BLOBS_CONTEXT). Fall back to implicit.
  try {
    store = mod.getStore({ name: "cms" });
  } catch {
    store = mod.getStore("cms");
  }
} catch (err) {
  console.error(`[sync-blobs] could not init blob store: ${err.message}`);
  console.error("[sync-blobs] continuing with committed JSON");
  process.exit(0);
}

const dataDir = path.join(process.cwd(), "data");
let synced = 0;
let missing = 0;
let failed = 0;

for (const key of keys) {
  try {
    const data = await store.get(key, { type: "json" });
    if (data === null || data === undefined) {
      console.log(`[sync-blobs] ○ ${key}: no blob, keeping committed`);
      missing++;
      continue;
    }
    const target = path.join(dataDir, `${key}.json`);
    fs.writeFileSync(target, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[sync-blobs] ✓ ${key}.json updated from blob`);
    synced++;
  } catch (err) {
    console.error(`[sync-blobs] ✗ ${key}: ${err.message}`);
    failed++;
  }
}

console.log(
  `[sync-blobs] done: ${synced} synced, ${missing} untouched, ${failed} failed`
);
// Always exit 0 — blob sync failures must not break the build.
process.exit(0);
