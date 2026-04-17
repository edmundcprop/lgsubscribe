import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const filePath = path.join(process.cwd(), "data/comparisons.json");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const comparisons = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const comparison = comparisons.find(
      (c: { slug: string }) => c.slug === slug
    );

    if (!comparison) {
      return NextResponse.json(
        { error: "Comparison not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(comparison);
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
    const comparisons = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = comparisons.findIndex(
      (c: { slug: string }) => c.slug === slug
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Comparison not found" },
        { status: 404 }
      );
    }

    comparisons[index] = { ...comparisons[index], ...body };
    fs.writeFileSync(filePath, JSON.stringify(comparisons, null, 2), "utf-8");

    return NextResponse.json(comparisons[index]);
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
    const comparisons = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = comparisons.findIndex(
      (c: { slug: string }) => c.slug === slug
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Comparison not found" },
        { status: 404 }
      );
    }

    const removed = comparisons.splice(index, 1)[0];
    fs.writeFileSync(filePath, JSON.stringify(comparisons, null, 2), "utf-8");

    return NextResponse.json(removed);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
