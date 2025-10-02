// OAuth callback: exchanges the code for a session and redirects.
// Works with Next.js 15 Route Handlers and @supabase/ssr.
import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function getNext(url: URL) {
  const n = url.searchParams.get("next");
  try {
    if (!n) return "/account";
    // Disallow open redirects
    const asUrl = new URL(n, url.origin);
    if (asUrl.origin !== url.origin) return "/account";
    return asUrl.pathname + asUrl.search + asUrl.hash || "/account";
  } catch {
    return "/account";
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = getNext(url);
  const supabase = createRouteHandlerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // On failure, send back to homepage with a hint
      const res = NextResponse.redirect(new URL(`/?auth_error=1`, req.url), { status: 303 });
      return res;
    }
  }

  return NextResponse.redirect(new URL(next, req.url), { status: 303 });
}
