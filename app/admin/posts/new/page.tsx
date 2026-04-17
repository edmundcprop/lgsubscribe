"use client";

import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Blog Post</h1>
      <PostForm />
    </div>
  );
}
