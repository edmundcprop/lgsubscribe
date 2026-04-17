import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/store";

export const dynamic = "force-dynamic";

type Comparison = { slug: string } & Record<string, unknown>;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const comparisons = await readData<Comparison[]>("comparisons");
    const comparison = comparisons.find((c) => c.slug === slug);

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
    const body = (await req.json()) as Partial<Comparison>;
    const comparisons = await readData<Comparison[]>("comparisons");
    const index = comparisons.findIndex((c) => c.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Comparison not found" },
        { status: 404 }
      );
    }

    comparisons[index] = { ...comparisons[index], ...body };
    await writeData("comparisons", comparisons);

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
    const comparisons = await readData<Comparison[]>("comparisons");
    const index = comparisons.findIndex((c) => c.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Comparison not found" },
        { status: 404 }
      );
    }

    const removed = comparisons.splice(index, 1)[0];
    await writeData("comparisons", comparisons);

    return NextResponse.json(removed);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
