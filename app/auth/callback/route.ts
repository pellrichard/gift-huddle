// app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import {
  createServerClient,
  type CookieMethodsServer,
  type CookieOptions,
} from "@supabase/ssr";

function safeNext(url: URL) {
  const n = url.searchParams.get("next");
  // Prevent open redirects; only allow same-origin relative paths
  if (n && n.startsWith("/")) return n;
  return "/account";
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Prepare a 200 HTML landing page that navigates after cookies are written.
  const target = safeNext(url);
  const html = `<!doctype html>
<meta charset="utf-8">
<title>Signing you in…</title>
<meta http-equiv="refresh" content="0; url=${target}">
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:2rem}</style>
<p>Signing you in… If you are not redirected automatically, <a href="${target}">continue</a>.</p>`;

  const res = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

  // Cookie adapter that READS from the request and WRITES to the response.
  const adapter: CookieMethodsServer = {
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
    { cookies: adapter, cookieEncoding: "base64url" }
  );

  if (code) {
    // This will set the sb-… cookies via our writable adapter.
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Return the HTML page (no 302) so cookies reliably land in the browser.
  return res;
}
