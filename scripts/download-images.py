"""
Download all product images from external URLs to public/uploads/products/{slug}/
and update data/products.json with local paths.

Run: python3 scripts/download-images.py
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_JSON = ROOT / "data" / "products.json"
UPLOADS_BASE = ROOT / "public" / "uploads" / "products"

def download_image(url, dest_path):
    """Download a single image. Returns True on success."""
    if not url or url.startswith("/uploads/"):
        return False  # Already local or empty

    dest_path = Path(dest_path)
    if dest_path.exists():
        return False  # Already downloaded

    dest_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        })
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            dest_path.write_bytes(data)
            return True
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError) as e:
        print(f"  FAIL: {url} → {e}")
        return False

def get_ext(url):
    """Extract file extension from URL."""
    path = url.split("?")[0].split("#")[0]
    ext = os.path.splitext(path)[1].lower()
    if ext in (".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg", ".mp4", ".webm"):
        return ext
    return ".jpg"  # default

def process_product(product, stats):
    """Download all images for a product and update URLs to local paths."""
    slug = product["slug"]
    product_dir = UPLOADS_BASE / slug
    changed = False

    # Main image
    if product.get("image") and not product["image"].startswith("/uploads/"):
        ext = get_ext(product["image"])
        local_name = f"main{ext}"
        local_path = product_dir / local_name
        local_url = f"/uploads/products/{slug}/{local_name}"

        if download_image(product["image"], local_path):
            stats["downloaded"] += 1
            print(f"  ✓ main{ext}")
        elif local_path.exists():
            stats["skipped"] += 1

        if local_path.exists():
            product["image"] = local_url
            changed = True

    # Gallery
    if product.get("gallery"):
        new_gallery = []
        for i, url in enumerate(product["gallery"]):
            if not url or url.startswith("/uploads/"):
                new_gallery.append(url)
                continue
            ext = get_ext(url)
            local_name = f"gallery-{i+1}{ext}"
            local_path = product_dir / local_name
            local_url = f"/uploads/products/{slug}/{local_name}"

            if download_image(url, local_path):
                stats["downloaded"] += 1
                print(f"  ✓ gallery-{i+1}{ext}")
            elif local_path.exists():
                stats["skipped"] += 1

            if local_path.exists():
                new_gallery.append(local_url)
                changed = True
            else:
                new_gallery.append(url)  # Keep original if download failed
                stats["failed"] += 1

        product["gallery"] = new_gallery

    # Sections
    if product.get("sections"):
        for i, section in enumerate(product["sections"]):
            img = section.get("image")
            if not img or img.startswith("/uploads/"):
                continue
            ext = get_ext(img)
            local_name = f"section-{i+1}{ext}"
            local_path = product_dir / local_name
            local_url = f"/uploads/products/{slug}/{local_name}"

            if download_image(img, local_path):
                stats["downloaded"] += 1
                print(f"  ✓ section-{i+1}{ext}")
            elif local_path.exists():
                stats["skipped"] += 1

            if local_path.exists():
                section["image"] = local_url
                changed = True
            else:
                stats["failed"] += 1

    return changed

def main():
    print(f"Reading {PRODUCTS_JSON}")
    with open(PRODUCTS_JSON) as f:
        products = json.load(f)

    stats = {"downloaded": 0, "skipped": 0, "failed": 0, "products": 0}

    for product in products:
        slug = product["slug"]
        print(f"\n[{slug}]")
        stats["products"] += 1
        process_product(product, stats)
        time.sleep(0.1)  # Be polite

    # Write updated products back
    with open(PRODUCTS_JSON, "w") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Done! {stats['products']} products processed")
    print(f"  Downloaded: {stats['downloaded']}")
    print(f"  Skipped (already local): {stats['skipped']}")
    print(f"  Failed: {stats['failed']}")
    print(f"  Images saved to: {UPLOADS_BASE}")
    print(f"  Updated: {PRODUCTS_JSON}")

if __name__ == "__main__":
    main()
