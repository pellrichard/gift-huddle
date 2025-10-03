import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// If you already have more complex logic, merge these early returns.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never block or rewrite auth or API routes
  if (pathname.startsWith("/auth/") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
