import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const filePath = path.join(process.cwd(), "data/posts.json");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const posts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const post = posts.find((p: { slug: string }) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const posts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = posts.findIndex((p: { slug: string }) => p.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    posts[index] = { ...posts[index], ...body };
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), "utf-8");

    return NextResponse.json(posts[index]);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const posts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = posts.findIndex((p: { slug: string }) => p.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const removed = posts.splice(index, 1)[0];
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), "utf-8");

    return NextResponse.json(removed);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
