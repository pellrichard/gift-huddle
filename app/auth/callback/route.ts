// app/auth/callback/route.ts
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

  // Create the FINAL redirect response up front.
  // We'll have Supabase write cookies directly onto THIS response,
  // so we don't lose any cookie flags/options.
  const res = NextResponse.redirect(target);

  // Adapter that writes directly to `res.cookies` with EXACT options
  const cookiesAdapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      // read from incoming request (if present)
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
    // expose minimal debug params for quick triage
    const cookieHeaders = res.headers.getSetCookie?.() ?? []; // nextjs runtime often exposes this helper
    const names = cookieHeaders
      .map((h: string) => h.split(";")[0].split("=")[0])
      .filter(Boolean)
      .slice(0, 8)
      .join(",");
    target.searchParams.set("link_debug", "1");
    target.searchParams.set("pkce", pkce);
    if (errorMessage) target.searchParams.set("link_error", encodeURIComponent(errorMessage));
    target.searchParams.set("cookies", String(cookieHeaders.length));
    if (names) target.searchParams.set("cookie_names", names);
    res.headers.set("x-gh-set-cookie-count", String(cookieHeaders.length));
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
