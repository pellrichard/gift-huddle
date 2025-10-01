// app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions, type CookieMethodsServer, type CookieMethodsServerDeprecated } from "@supabase/ssr";

function safeNext(url: URL, nextParam: string | null) {
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/account";
  return new URL(next, url.origin);
}

function htmlRedirect(to: URL, diag: Record<string, string | number | undefined>) {
  const params = new URL(to);
  for (const [k, v] of Object.entries(diag)) {
    if (v !== undefined) params.searchParams.set(k, String(v));
  }
  const dest = params.toString();
  const body = `<!doctype html>
<meta charset="utf-8" />
<meta http-equiv="refresh" content="0; url=${dest}"/>
<title>Redirecting…</title>
<p>Redirecting to <a href="${dest}">${dest}</a></p>
<script>location.replace(${JSON.stringify(dest)});</script>`;
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const target = safeNext(url, nextParam);

  // We'll return an HTML 200 response and navigate with JS/meta.
  const res = NextResponse.next();

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

  if (!code) {
    const html = htmlRedirect(target, { link_debug: 1, pkce: "skipped_no_code" });
    // merge cookies set on res into html Response
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) html.headers.append("set-cookie", setCookie);
    return html;
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const setCookie = res.headers.get("set-cookie") || "";
    const cookieNames = setCookie
      .split(/,(?=[^;]+?=)/)
      .map(s => s.split(";")[0].split("=")[0].trim())
      .filter(Boolean)
      .slice(0, 8)
      .join(",");

    const html = htmlRedirect(target, {
      link_debug: 1,
      pkce: error ? "error" : "ok",
      cookie_names: cookieNames || undefined,
      link_error: error?.message ? encodeURIComponent(error.message) : undefined,
    });
    if (setCookie) html.headers.append("set-cookie", setCookie);
    return html;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unexpected_error_exchanging_code";
    const html = htmlRedirect(target, { link_debug: 1, pkce: "exception", link_error: encodeURIComponent(message) });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) html.headers.append("set-cookie", setCookie);
    return html;
  }
}
