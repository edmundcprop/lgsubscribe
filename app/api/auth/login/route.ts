import { NextResponse } from "next/server";
import { comparePassword, signToken } from "@/lib/auth";
import { readData } from "@/lib/store";

export const dynamic = "force-dynamic";

type User = { id: string; username: string; password: string; role: string };

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const users = await readData<User[]>("users");
    const user = users.find((u) => u.username === username);

    if (!user || !comparePassword(password, user.password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      user: { id: user.id, username: user.username, role: user.role },
    });

    response.cookies.set("cms_token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
