import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-compatible middleware — only checks if the cms_token cookie exists.
 * Full JWT verification happens in the API route handlers (Node.js runtime).
 * This avoids importing bcryptjs/jsonwebtoken which need Node.js APIs.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login and /api/auth/login without auth
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/login/" ||
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/login/"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("cms_token")?.value;

  // Protect /admin/* — redirect to login if no cookie
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect /api/* — return 401 if no cookie
  if (pathname.startsWith("/api")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
