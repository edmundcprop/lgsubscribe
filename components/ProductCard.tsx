import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.category}/${product.slug}`}
      className="product-card group"
    >
      <div className="aspect-[4/3] overflow-hidden bg-lg-cloud">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col bg-white px-6 py-8">
        {product.model && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-silver">
            {product.model}
          </div>
        )}
        <h3 className="mt-2 text-lg font-semibold text-lg-ink">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[14px] text-lg-stone">
          {product.tagline}
        </p>
        <div className="mt-auto pt-6">
          {product.price ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] text-lg-stone">From</span>
              <span className="text-xl font-semibold text-lg-ink">
                RM{product.price}
              </span>
              <span className="text-[13px] text-lg-stone">/month</span>
            </div>
          ) : product.outright ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] text-lg-stone">From</span>
              <span className="text-xl font-semibold text-lg-ink">
                RM{product.outright.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-[14px] font-medium text-lg-red">
              Contact us →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
