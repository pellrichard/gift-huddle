import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/account";

  if (code) {
    try {
      const supabase = createServerComponentClient();
      // This exchanges the OAuth code for a session and sets the Supabase auth cookies on the response
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      // If exchange fails, fall back to login
      return NextResponse.redirect(new URL("/login", url.origin), { status: 302 });
    }
  }
  return NextResponse.redirect(new URL(next, url.origin), { status: 302 });
}
