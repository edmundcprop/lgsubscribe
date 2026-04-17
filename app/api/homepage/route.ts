import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/store";

export const dynamic = "force-dynamic";

type Homepage = Record<string, unknown>;

export async function GET() {
  try {
    const data = await readData<Homepage>("homepage");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Homepage;
    await writeData("homepage", body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
