/* app/auth/callback/route.ts
 * Fix: avoid const reassignment; robust Supabase PKCE exchange + safe redirects.
 * Next.js 15 / @supabase/ssr v2 style.
 */
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // next/headers cookies are mutable in route handlers
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );
}

function safeNext(url: URL, nextParam: string | null) {
  // Default to /account; block open redirects
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/account";
  return new URL(next, url.origin);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const target = safeNext(url, nextParam);

  if (!code) {
    // No code present; bounce to login with a hint
    target.searchParams.set("link_error", encodeURIComponent("missing_code"));
    return NextResponse.redirect(target);
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      target.searchParams.set("link_error", encodeURIComponent(error.message));
      return NextResponse.redirect(target);
    }

    // Success — send the user to the intended page
    target.searchParams.delete("link_error");
    return NextResponse.redirect(target);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "unexpected_error_exchanging_code";
    target.searchParams.set("link_error", encodeURIComponent(message));
    return NextResponse.redirect(target);
  }
}
