import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";
  const code = url.searchParams.get("code");

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  if (code) {
    try {
      // IMPORTANT: use the Route Handler client so cookies are written to the response
      await supabase.auth.exchangeCodeForSession(code);
    } catch (_e) {
      return NextResponse.redirect(new URL("/login", url.origin), { status: 302 });
    }
  }

  return NextResponse.redirect(new URL(next, url.origin), { status: 302 });
}
