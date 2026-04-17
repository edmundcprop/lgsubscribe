import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const filePath = path.join(process.cwd(), "data/users.json");

export async function GET() {
  try {
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const safe = users.map(
      ({ password: _, ...rest }: { password: string; [key: string]: unknown }) =>
        rest
    );
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const exists = users.find(
      (u: { username: string }) => u.username === body.username
    );
    if (exists) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const newUser = {
      id: String(Date.now()),
      username: body.username,
      password: hashPassword(body.password),
      role: body.role || "editor",
    };

    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

    const { password: _, ...safe } = newUser;
    return NextResponse.json(safe, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }

    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = users.findIndex((u: { id: string }) => u.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const removed = users.splice(index, 1)[0];
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

    const { password: _, ...safe } = removed;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
