import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/store";

export const dynamic = "force-dynamic";

type Post = {
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

/**
 * POST /api/posts/upload
 * Accepts a .md file upload, parses frontmatter, and adds the post to the posts store.
 *
 * Expected markdown format:
 * ---
 * title: "Post Title"
 * slug: "post-slug"
 * description: "Short description for SEO"
 * date: "2026-04-16"
 * readingTime: "5 min read"
 * category: "Buying Guide"
 * image: "https://... or /uploads/..."
 * excerpt: "One-paragraph summary shown on the blog index."
 * ---
 * ## Markdown body here...
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.endsWith(".md")) {
      return NextResponse.json(
        { error: "Please upload a .md (markdown) file" },
        { status: 400 }
      );
    }

    const text = await file.text();

    const fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!fmMatch) {
      return NextResponse.json(
        {
          error:
            "Invalid markdown format. File must start with --- frontmatter --- followed by body content.",
        },
        { status: 400 }
      );
    }

    const frontmatterRaw = fmMatch[1];
    const body = fmMatch[2].trim();

    const fm: Record<string, string> = {};
    for (const line of frontmatterRaw.split("\n")) {
      const match = line.match(/^(\w+)\s*:\s*"?([^"]*)"?\s*$/);
      if (match) {
        fm[match[1]] = match[2].trim();
      }
    }

    const required = ["title", "slug", "description"];
    for (const field of required) {
      if (!fm[field]) {
        return NextResponse.json(
          { error: `Missing required frontmatter field: ${field}` },
          { status: 400 }
        );
      }
    }

    const post: Post = {
      slug: fm.slug,
      title: fm.title,
      description: fm.description,
      date: fm.date || new Date().toISOString().split("T")[0],
      readingTime: fm.readingTime || fm.reading_time || "5 min read",
      category: fm.category || "General",
      image: fm.image || "",
      excerpt: fm.excerpt || fm.description,
      body,
    };

    const posts = await readData<Post[]>("posts");
    const existingIdx = posts.findIndex((p) => p.slug === post.slug);

    if (existingIdx >= 0) {
      posts[existingIdx] = post;
    } else {
      posts.push(post);
    }

    await writeData("posts", posts);

    return NextResponse.json(
      {
        message: existingIdx >= 0 ? "Post updated" : "Post created",
        post: { slug: post.slug, title: post.title },
      },
      { status: existingIdx >= 0 ? 200 : 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to process file: ${e}` },
      { status: 500 }
    );
  }
}
