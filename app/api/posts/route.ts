import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/store";

export const dynamic = "force-dynamic";

type Post = { slug: string; title?: string } & Record<string, unknown>;

export async function GET() {
  try {
    const data = await readData<Post[]>("posts");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Post;
    const posts = await readData<Post[]>("posts");

    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    posts.push(body);
    await writeData("posts", posts);

    return NextResponse.json(body, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
