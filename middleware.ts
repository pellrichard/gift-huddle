import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // This will refresh the session if it exists and set the cookie.
  await supabase.auth.getSession();

  return res;
}

// Apply to all routes except static and API assets.
export const config = {
  matcher: ["/((?!_next|.*\..*|api).*)"],
};
