// app/auth/callback/route.ts
export const runtime = "nodejs";          // ensure Node.js runtime (not Edge)
export const dynamic = "force-dynamic";   // disable caching of this route
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions, type CookieMethodsServer, type CookieMethodsServerDeprecated } from "@supabase/ssr";

function safeNext(url: URL, nextParam: string | null) {
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/account";
  return new URL(next, url.origin);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const target = safeNext(url, nextParam);

  const res = NextResponse.redirect(target);
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  const cookiesAdapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return req.cookies.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieOptions): void {
      res.cookies.set({ name, value, ...(options ?? {}) });
    },
    remove(name: string, valueOrOptions?: string | CookieOptions, maybeOptions?: CookieOptions): void {
      const opts: CookieOptions | undefined =
        typeof valueOrOptions === "object" && valueOrOptions !== null
          ? valueOrOptions
          : maybeOptions;
      res.cookies.set({ name, value: "", ...(opts ?? {}), maxAge: 0 });
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookiesAdapter,
      cookieEncoding: "base64url",
    }
  );

  const withDiag = (pkce: string, errorMessage?: string) => {
    const names = (res.headers.get("set-cookie") || "")
      .split(/,(?=[^;]+?=)/) // split multiple Set-Cookie values
      .map(s => s.split(";")[0].split("=")[0].trim())
      .filter(Boolean)
      .slice(0, 8)
      .join(",");
    target.searchParams.set("link_debug", "1");
    target.searchParams.set("pkce", pkce);
    if (errorMessage) target.searchParams.set("link_error", encodeURIComponent(errorMessage));
    target.searchParams.set("cookie_names", names);
    res.headers.set("x-gh-set-cookie-count", String((res.headers.get("set-cookie") || "").split(/,(?=[^;]+?=)/).filter(Boolean).length));
    res.headers.set("Location", target.toString()); // ensure updated query params
  };

  if (!code) {
    withDiag("skipped_no_code", "missing_code");
    return res;
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    withDiag(error ? "error" : "ok", error?.message);
    return res;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "unexpected_error_exchanging_code";
    withDiag("exception", message);
    return res;
  }
}
