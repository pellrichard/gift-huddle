// app/auth/callback/route.ts — persist Supabase cookies then redirect
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerSupabase } from "@/lib/supabase/server";

function getNext(url: URL) {
  const n = url.searchParams.get("next");
  return n && n.startsWith("/") ? n : "/account";
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") ?? undefined;

  // Prepare the redirect response first so Supabase can write cookies into it
  const res = NextResponse.redirect(new URL(getNext(url), url));

  // Bind Supabase to this req/res so exchangeCodeForSession can set cookies
  const supabase = createRouteHandlerSupabase(req, res);

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Helper cookie to aid middleware immediately after login (optional)
  try {
    res.cookies.set({
      name: "gh_authed",
      value: "1",
      path: "/",
      maxAge: 60 * 60 * 6, // 6 hours
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  } catch {}

  return res;
}
