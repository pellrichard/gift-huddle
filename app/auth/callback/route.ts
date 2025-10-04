import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";
  const code = url.searchParams.get("code");

  const cookieStore = cookies();

  // Prepare the response we will return (and attach Set-Cookie headers to)
  const response = NextResponse.redirect(new URL(next, url.origin), { status: 302 });

  // Create a Supabase server client that reads from the incoming cookies and WRITES to the response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set({ name, value, ...(options ?? {}) });
          }
        },
      },
    }
  );

  if (code) {
    try {
      // Exchange the OAuth code for a session and write sb-* cookies onto the response
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      return NextResponse.redirect(new URL("/login", url.origin), { status: 302 });
    }
  }

  return response;
}
