// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions, type CookieMethodsServer, type CookieMethodsServerDeprecated } from "@supabase/ssr";

type CookieSameSite = "lax" | "strict" | "none";
interface CookieOptsLite {
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

  const tmp = NextResponse.next();
  const cookiesAdapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return req.cookies.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieOptions | CookieOptsLite): void {
      const opts: CookieOptsLite | undefined = options ? { ...options } : undefined;
      tmp.cookies.set({ name, value, ...(opts ?? {}) });
    },
    remove(name: string, valueOrOptions?: string | CookieOptions | CookieOptsLite, maybeOptions?: CookieOptions | CookieOptsLite): void {
      const opts: CookieOptsLite | undefined =
        typeof valueOrOptions === "object" && valueOrOptions !== null
          ? { ...valueOrOptions }
          : maybeOptions
          ? { ...maybeOptions }
          : undefined;
      tmp.cookies.set({ name, value: "", ...(opts ?? {}), maxAge: 0 });
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookiesAdapter,
      cookieEncoding: "base64", // write cookies with base64 marker understood by server
    }
  );

  const mkRedirect = () => {
    const res = NextResponse.redirect(target);
    const pending = tmp.cookies.getAll();
    for (const c of pending) res.cookies.set(c);
    res.headers.set("x-gh-set-cookie-count", String(pending.length));
    // include a compact list of cookie names for quick triage (max 4 to keep URL short)
    const names = pending.slice(0, 4).map(c => c.name).join(",");
    if (names) target.searchParams.set("cookie_names", names);
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
    const pending = tmp.cookies.getAll();
    const cookieCount = pending.length;
    const cookieNames = pending.map(c => c.name);

    console.log("[auth/callback v6] exchange", {
      host: url.host,
      elapsed_ms: elapsed,
      cookie_count: cookieCount,
      cookie_names: cookieNames,
      has_error: Boolean(error),
      error_message: error?.message,
    });

    target.searchParams.set("link_debug", "1");
    target.searchParams.set("pkce", error ? "error" : "ok");
    target.searchParams.set("cookies", String(cookieCount));
    target.searchParams.set("host", url.host);
    if (cookieNames.length) target.searchParams.set("cookie_names", cookieNames.slice(0,4).join(","));
    if (error) {
      target.searchParams.set("link_error", encodeURIComponent(error.message));
    } else {
      target.searchParams.delete("link_error");
    }

    return mkRedirect();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "unexpected_error_exchanging_code";
    console.error("[auth/callback v6] exception", { host: url.host, message });

    target.searchParams.set("link_debug", "1");
    target.searchParams.set("pkce", "exception");
    target.searchParams.set("cookies", "0");
    target.searchParams.set("host", url.host);
    target.searchParams.set("link_error", encodeURIComponent(message));

    return mkRedirect();
  }
}
