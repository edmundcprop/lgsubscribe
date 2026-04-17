import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/store";

export const dynamic = "force-dynamic";

type Product = { slug: string; name?: string } & Record<string, unknown>;

export async function GET() {
  try {
    const data = await readData<Product[]>("products");
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
    const body = (await req.json()) as Product;
    const products = await readData<Product[]>("products");

    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    products.push(body);
    await writeData("products", products);

    return NextResponse.json(body, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
