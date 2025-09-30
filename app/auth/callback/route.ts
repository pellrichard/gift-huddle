/* app/auth/callback/route.ts
 * Next.js 15 + Supabase PKCE callback with reliable cookie writes on redirects.
 * Strategy:
 *  - Use a temporary Response to let Supabase write Set-Cookie
 *  - Copy those cookies onto the final NextResponse.redirect(...)
 *  - No `any`, no const reassignments, safe relative redirects only
 */
import { NextResponse, type NextRequest } from "next/server";
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

function safeNext(url: URL, nextParam: string | null) {
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/account";
  return new URL(next, url.origin);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");

  // Temporary response to collect Set-Cookie from Supabase
  const tmp = NextResponse.next();

  const getCookie = (name: string): string | undefined => {
    return req.cookies.get(name)?.value;
  };
  const setCookie = (name: string, value: string, options: CookieOptions): void => {
    tmp.cookies.set({ name, value, ...options });
  };
  const removeCookie = (name: string, options: CookieOptions): void => {
    tmp.cookies.set({ name, value: "", ...options, maxAge: 0 });
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: getCookie, set: setCookie, remove: removeCookie } }
  );

  // Prepare final target URL (may be augmented with error details)
  const target = safeNext(url, nextParam);

  if (!code) {
    target.searchParams.set("link_error", encodeURIComponent("missing_code"));
    const res = NextResponse.redirect(target);
    // copy any pending cookies (likely none in this branch)
    for (const c of tmp.cookies.getAll()) res.cookies.set(c);
    return res;
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      target.searchParams.set("link_error", encodeURIComponent(error.message));
    } else {
      target.searchParams.delete("link_error");
    }

    const res = NextResponse.redirect(target);
    // Copy cookies Supabase wrote on tmp -> res so they actually get set
    for (const c of tmp.cookies.getAll()) res.cookies.set(c);
    return res;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "unexpected_error_exchanging_code";
    target.searchParams.set("link_error", encodeURIComponent(message));
    const res = NextResponse.redirect(target);
    for (const c of tmp.cookies.getAll()) res.cookies.set(c);
    return res;
  }
}
