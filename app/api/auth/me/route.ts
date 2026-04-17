import { NextResponse } from "next/server";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";
import { readData } from "@/lib/store";

export const dynamic = "force-dynamic";

type User = { id: string; username: string; password: string; role: string };

export async function GET(req: Request) {
  try {
    const token = getTokenFromCookies(req);
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const users = await readData<User[]>("users");
    const user = users.find((u) => u.id === payload.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password: _password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
