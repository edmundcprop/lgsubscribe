"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-3xl bg-lg-mist">
        <img
          src={images[active]}
          alt={alt}
          className="aspect-[4/3] h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-xl ring-2 transition ${
                active === i
                  ? "ring-lg-red"
                  : "ring-transparent hover:ring-black/10"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={src}
                alt=""
                className="aspect-square h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
