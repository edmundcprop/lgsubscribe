// Runs before `next build`. If we're in a Netlify build, pull each CMS
// dataset from Netlify Blobs and overwrite the committed data/*.json so
// SSG picks up admin edits. Outside Netlify, do nothing.

import fs from "node:fs";
import path from "node:path";

if (process.env.NETLIFY !== "true") {
  console.log("[sync-blobs] not on Netlify, skipping");
  process.exit(0);
}

const { getStore } = await import("@netlify/blobs");

const keys = [
  "posts",
  "products",
  "comparisons",
  "categories",
  "homepage",
  "site",
  "users",
];

const store = getStore("cms");
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
