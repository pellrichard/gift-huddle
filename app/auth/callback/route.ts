/* app/auth/callback/route.ts
 * v4: Adds server-side logging + browser-visible debug flags to trace PKCE + cookies.
 * - Captures Supabase Set-Cookie on a temp response and copies to the redirect.
 * - Appends link_debug params: pkce, cookies, host, and error (if any).
 * - No `any`, no const reassignments, safe relative redirects only.
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
  const target = safeNext(url, nextParam);

  // temp response collects any Set-Cookie from Supabase
  const tmp = NextResponse.next();

  const getCookie = (name: string): string | undefined => req.cookies.get(name)?.value;
  const setCookie = (name: string, value: string, options: CookieOptions): void => {
    tmp.cookies.set({ name, value, ...options });
  };
  const removeCookie = (name: string, value: string, options: CookieOptions): void => {
    tmp.cookies.set({ name, value: "", ...options, maxAge: 0 });
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: getCookie, set: setCookie, remove: removeCookie } }
  );

  const mkRedirect = () => {
    const res = NextResponse.redirect(target);
    // Copy all cookies the exchange wrote onto the final redirect
    const pending = tmp.cookies.getAll();
    for (const c of pending) res.cookies.set(c);
    // Helpful header in Network panel
    res.headers.set("x-gh-set-cookie-count", String(pending.length));
    return res;
  };

  if (!code) {
    target.searchParams.set("link_error", encodeURIComponent("missing_code"));
    target.searchParams.set("link_debug", "1");
    target.searchParams.set("pkce", "skipped_no_code");
    target.searchParams.set("cookies", "0");
    target.searchParams.set("host", url.host);
    return mkRedirect();
  }

  try {
    const t0 = Date.now();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const elapsed = Date.now() - t0;

    // Count any cookies Supabase attempted to set
    const cookieCount = tmp.cookies.getAll().length;

    // Server-side logs visible in Vercel
    console.log("[auth/callback] exchangeCodeForSession", {
      host: url.host,
      elapsed_ms: elapsed,
      cookie_count: cookieCount,
      has_error: Boolean(error),
      error_message: error?.message,
    });

    target.searchParams.set("link_debug", "1");
    target.searchParams.set("pkce", error ? "error" : "ok");
    target.searchParams.set("cookies", String(cookieCount));
    target.searchParams.set("host", url.host);
    if (error) {
      target.searchParams.set("link_error", encodeURIComponent(error.message));
    } else {
      target.searchParams.delete("link_error");
    }

    return mkRedirect();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "unexpected_error_exchanging_code";
    console.error("[auth/callback] exception", { host: url.host, message });

    target.searchParams.set("link_debug", "1");
    target.searchParams.set("pkce", "exception");
    target.searchParams.set("cookies", "0");
    target.searchParams.set("host", url.host);
    target.searchParams.set("link_error", encodeURIComponent(message));

    return mkRedirect();
  }
}
