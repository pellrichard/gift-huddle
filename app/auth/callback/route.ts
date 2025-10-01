// app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import {
  createServerClient,
  type CookieMethodsServer,
  type CookieMethodsServerDeprecated,
} from "@supabase/ssr";

function cookieBaseFromReqOrUrl(req: NextRequest, supabaseUrl: string) {
  const raw = req.headers.get("cookie") ?? "";
  const m = raw.match(/(?:^|;\s*)(sb-[a-z0-9]+)-auth-token\.\d=/i);
  if (m && m[1]) return m[1];
  const host = new URL(supabaseUrl).hostname.replace(/[.\-]/g, "");
  return `sb-${host.slice(0, 20)}`.toLowerCase();
}

function nextUrl(url: URL, dest: string | null) {
  const next = dest && dest.startsWith("/") ? dest : "/account";
  return new URL(next, url.origin);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const target = nextUrl(url, nextParam);

  const res = NextResponse.redirect(target);

  const adapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return req.cookies.get(name)?.value;
    },
    set(): void {
      // no-op
    },
    remove(): void {
      // no-op
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: adapter, cookieEncoding: "base64url" }
  );

  if (!code) return res;

  await supabase.auth.exchangeCodeForSession(code);

  const { data: sess } = await supabase.auth.getSession();
  const s = sess?.session;
  const accessToken = s?.access_token ?? null;
  const refreshToken = s?.refresh_token ?? null;
  const tokenType: string = s?.token_type ?? "bearer";
  const expiresAtSec: number = s?.expires_at ?? Math.floor(Date.now() / 1000) + 60 * 60;
  const expiresInSec: number = Math.max(0, expiresAtSec - Math.floor(Date.now() / 1000));
  const base = cookieBaseFromReqOrUrl(req, process.env.NEXT_PUBLIC_SUPABASE_URL!);
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  if (accessToken) {
    const authPayload = {
      access_token: accessToken,
      token_type: tokenType,
      expires_in: expiresInSec,
      expires_at: expiresAtSec,
      provider_token: null as string | null,
    };
    res.cookies.set({
      name: `${base}-auth-token.0`,
      value: `base64-${Buffer.from(JSON.stringify(authPayload)).toString("base64url")}`,
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
    });
    res.cookies.set({
      name: `${base}-auth-token.1`,
      value: Buffer.from("fields=email,first_name,last_name,full_name,avatar_url,provider,provider_id").toString("base64url"),
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
    });
  }

  if (refreshToken) {
    const refreshPayload = { refresh_token: refreshToken };
    res.cookies.set({
      name: `${base}-refresh-token.0`,
      value: `base64-${Buffer.from(JSON.stringify(refreshPayload)).toString("base64url")}`,
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
    });
    res.cookies.set({
      name: `${base}-refresh-token.1`,
      value: Buffer.from("fields=email,first_name,last_name,full_name,avatar_url,provider,provider_id").toString("base64url"),
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
    });
  }

  res.cookies.set({
    name: `${base}-auth-token-code-verifier`,
    value: "",
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
  });

  return res;
}
