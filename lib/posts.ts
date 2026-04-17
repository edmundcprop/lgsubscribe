export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  image: string;
  excerpt: string;
  body: string;
};

import postsData from "../data/posts.json";

export const posts: Post[] = postsData as Post[];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
