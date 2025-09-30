/* app/auth/callback/route.ts
 * Next.js 15 + Supabase PKCE callback.
 * - No const reassignments
 * - No `any` types
 * - Works across differing `cookies()` typings by casting to a narrow interface
 */
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type CookieSameSite = "lax" | "strict" | "none";
interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: CookieSameSite;
  maxAge?: number;
}
interface CookieStoreShape {
  get(name: string): { value: string } | undefined;
  set(init: { name: string; value: string } & CookieOptions): void;
}

function getSupabase() {
  // Cast to a minimal shape so we can call .get/.set without pulling in
  // environment-specific Promise typings.
  const cookieStore = cookies() as unknown as CookieStoreShape;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string): string | undefined {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions): void {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions): void {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );
}

function safeNext(url: URL, nextParam: string | null) {
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/account";
  return new URL(next, url.origin);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const target = safeNext(url, nextParam);

  if (!code) {
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

    target.searchParams.delete("link_error");
    return NextResponse.redirect(target);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "unexpected_error_exchanging_code";
    target.searchParams.set("link_error", encodeURIComponent(message));
    return NextResponse.redirect(target);
  }
}
