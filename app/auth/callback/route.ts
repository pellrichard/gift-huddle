import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { buildCookieAdapter } from "@/lib/auth/cookies";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";

  // Prepare a Response we can attach Set-Cookie headers to
  const response = new NextResponse(null, { status: 302 });
  response.headers.set("Location", next);

  // Build a cookie adapter (so Supabase can read+write auth cookies)
  const cookieAdapter = buildCookieAdapter(request.headers.get("cookie"), response);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: cookieAdapter.getAll, setAll: cookieAdapter.setAll } }
  );

  const code = url.searchParams.get("code") || "";
  if (!code) {
    // No code? Just bounce.
    return response;
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Still redirect, but back to login with an error hint
      response.headers.set("Location", `/login?error=${encodeURIComponent(error.message)}`);
    }
  } catch {
    // Non-fatal: redirect back to login
    response.headers.set("Location", `/login?error=callback-failed`);
  }

  return response;
}
