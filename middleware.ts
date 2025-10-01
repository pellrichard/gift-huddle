import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Simple cookie check. Supabase sets sb-access-token/sb-refresh-token in our setup.
function hasAuthCookie(req: NextRequest) {
  const c = req.cookies;
  return Boolean(c.get("sb-access-token") || c.get("sb-refresh-token") || c.get("supabase-auth-token"));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthed = hasAuthCookie(req);

  // Redirect authed users away from login/signup
  if (isAuthed && (pathname === "/login" || pathname === "/signup")) {
    const url = req.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  // Protect /account for unauthenticated users
  if (!isAuthed && pathname.startsWith("/account")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Let everything else pass through
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/account/:path*"],
};
