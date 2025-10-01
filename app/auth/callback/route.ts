// app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import {
  createServerClient,
  type CookieOptions,
  type CookieMethodsServer,
  type CookieMethodsServerDeprecated,
} from "@supabase/ssr";

/** Derive the cookie base prefix:
 *  1) If an existing 'sb-…-auth-token' cookie is in the *incoming* header, reuse that base.
 *  2) Otherwise, derive a stable fallback from the Supabase URL host.
 */
function cookieBaseFromReqOrUrl(req: NextRequest, supabaseUrl: string) {
  const raw = req.headers.get("cookie") ?? "";
  // e.g. "sb-kzcfryzzxxzyoizlehse-auth-token.0=…"
  const m = raw.match(/(?:^|;\s*)(sb-[a-z0-9]+)-auth-token\.\d=/i);
  if (m && m[1]) return m[1]; // "sb-kzcfryzzxxzyoizlehse"
  // fallback: strip dots/hyphens from host and take first 20 chars
  const host = new URL(supabaseUrl).hostname.replace(/[.\-]/g, "");
  return `sb-${host.slice(0, 20)}`.toLowerCase();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const target = new URL(nextParam && nextParam.startsWith("/") ? nextParam : "/account", url.origin);

  // We'll return a redirect and set cookies directly on it.
  const res = NextResponse.redirect(target);

  // Cookie adapter that reads from the incoming request, writes nothing (we set explicitly below).
  const adapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return req.cookies.get(name)?.value;
    },
    set(_name: string, _value: string, _options?: CookieOptions): void {
      // no-op: we set explicit cookies below to avoid any runtime dropping Set-Cookie
    },
    remove(_name: string, _valueOrOpts?: string | CookieOptions, _maybe?: CookieOptions): void {
      // no-op
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: adapter, cookieEncoding: "base64url" }
  );

  if (!code) return res;

  // 1) Exchange code for a session
  await supabase.auth.exchangeCodeForSession(code);

  // 2) Read session tokens
  const { data: sess } = await supabase.auth.getSession();
  const accessToken = sess?.session?.access_token ?? null;
  const refreshToken = sess?.session?.refresh_token ?? null;

  // 3) Compute cookie base prefix (re-use if any exists on the request)
  const base = cookieBaseFromReqOrUrl(req, process.env.NEXT_PUBLIC_SUPABASE_URL!);

  // 4) Set BOTH cookie pairs directly on the redirect response
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  if (accessToken) {
    res.cookies.set({
      name: `${base}-auth-token.0`,
      value: `base64-${Buffer.from(JSON.stringify({ access_token: accessToken })).toString("base64url")}`,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires,
    });
    res.cookies.set({
      name: `${base}-auth-token.1`,
      value: Buffer.from("fields=email,first_name,last_name,full_name,avatar_url,provider,provider_id").toString("base64url"),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires,
    });
  }
  if (refreshToken) {
    res.cookies.set({
      name: `${base}-refresh-token.0`,
      value: `base64-${Buffer.from(JSON.stringify({ refresh_token: refreshToken })).toString("base64url")}`,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires,
    });
    res.cookies.set({
      name: `${base}-refresh-token.1`,
      value: Buffer.from("fields=email,first_name,last_name,full_name,avatar_url,provider,provider_id").toString("base64url"),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires,
    });
  }

  return res;
}
