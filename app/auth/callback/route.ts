import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";
  const code = url.searchParams.get("code");

  // Prepare the redirect response up-front so we can attach Set-Cookie headers to it.
  const response = NextResponse.redirect(new URL(next, url.origin), { status: 302 });

  // Infer the cookie options type from NextResponse.cookies.set signature
  type CookieOptions = Parameters<typeof response.cookies.set>[2];

  // Create a Supabase server client that only writes cookies to the outgoing response.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookiesToSet: { name: string; value: string; options?: unknown }[]) {
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
