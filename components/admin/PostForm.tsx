"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";

interface PostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  image: string;
  excerpt: string;
  body: string;
}

const emptyPost: PostData = {
  slug: "",
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  readingTime: "5 min read",
  category: "",
  image: "",
  excerpt: "",
  body: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PostForm({
  initialData,
  isEdit = false,
}: {
  initialData?: PostData;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [form, setForm] = useState<PostData>(initialData || emptyPost);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const set = <K extends keyof PostData>(key: K, val: PostData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "title" && !isEdit) {
        next.slug = slugify(val as string);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = isEdit ? `/api/posts/${form.slug}` : "/api/posts";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(isEdit ? "Post updated" : "Post created", "success");
        if (!isEdit) {
          setTimeout(() => router.push("/admin/posts"), 1000);
        }
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to save post", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <ToastContainer />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              required
              readOnly={isEdit}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Buying Guide"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reading Time</label>
            <input
              type="text"
              value={form.readingTime}
              onChange={(e) => set("readingTime", e.target.value)}
              placeholder="5 min read"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (SEO)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Body (Markdown)</label>
            <textarea
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              rows={20}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#A50034] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#8a002c] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
