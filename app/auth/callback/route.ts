import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";
  const code = url.searchParams.get("code");

  const response = NextResponse.redirect(new URL(next, url.origin), { status: 302 });

  type CookieOptions = Parameters<typeof response.cookies.set>[2];
  type SupabaseCookie = { name: string; value: string; options?: Record<string, unknown> };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() { return []; },
        setAll(cookiesToSet: SupabaseCookie[]) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options as CookieOptions);
          }
        },
      },
    }
  );

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      return NextResponse.redirect(new URL("/login", url.origin), { status: 302 });
    }
  }

  return response;
}
