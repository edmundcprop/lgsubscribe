"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  placeholder = "https://... or upload",
  label,
}: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      }
    } catch {
      // silent fail
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#A50034] focus:outline-none focus:ring-2 focus:ring-[#A50034]/30"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <svg
                className="h-3.5 w-3.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Uploading
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Upload
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.avif,.webp,video/mp4,video/webm,.mp4,.webm"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      {value && (
        <div className="mt-2">
          {/\.(mp4|webm)$/i.test(value) ? (
            <video
              src={value}
              className="h-20 w-32 rounded-lg border border-gray-200 object-cover"
              muted
              playsInline
            />
          ) : (
            <img
              src={value}
              alt=""
              className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Gallery version — manages a list of image URLs with upload support for each.
 */
export function GalleryUpload({
  items,
  onChange,
}: {
  items: string[];
  onChange: (urls: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        }
      } catch {
        // skip failed
      }
    }

    onChange([...items, ...newUrls]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      {/* Existing items */}
      <div className="space-y-2">
        {items.map((url, i) => (
          <div key={i} className="flex items-center gap-2">
            <img
              src={url}
              alt=""
              className="h-10 w-10 shrink-0 rounded border border-gray-200 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "";
              }}
            />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#A50034] focus:outline-none focus:ring-2 focus:ring-[#A50034]/30"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg px-2 py-2 text-xs text-red-500 hover:bg-red-50"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add buttons */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="text-xs font-medium text-[#A50034] hover:text-[#A50034]/80"
        >
          + Add URL
        </button>
        <span className="text-xs text-gray-300">|</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#A50034] hover:text-[#A50034]/80 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <svg
                className="h-3 w-3 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Upload images
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.avif,.webp,video/mp4,video/webm,.mp4,.webm"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
