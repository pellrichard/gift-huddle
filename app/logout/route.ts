import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Prepare redirect response up-front so Supabase can write cookie changes into it
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/", url)); // send user to homepage after logout

  // Bind Supabase to this req/res to clear cookies properly
  const supabase = createRouteHandlerSupabase(req, res);
  try {
    await supabase.auth.signOut();
  } catch {}

  // Also clear our helper cookie
  try {
    res.cookies.set({ name: "gh_authed", value: "", path: "/", maxAge: 0 });
  } catch {}

  return res;
}
