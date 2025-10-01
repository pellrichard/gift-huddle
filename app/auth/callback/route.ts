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
  let target = nextUrl(url, nextParam);

  const res = NextResponse.redirect(target);

  const adapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return req.cookies.get(name)?.value;
    },
    set(_name: string, _value: string, _options?: CookieOptions): void {
      // no-op; we'll set explicitly below
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

  // 1) Exchange PKCE code
  await supabase.auth.exchangeCodeForSession(code);

  // 2) Read session & tokens
  const { data: sess } = await supabase.auth.getSession();
  const accessToken = sess?.session?.access_token ?? null;
  const refreshToken = sess?.session?.refresh_token ?? null;
  const userId = sess?.session?.user?.id ?? null;

  // 3) Decide destination based on profile completeness
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("preferred_currency, notify_channel")
      .eq("id", userId)
      .single();

    const incomplete = !profile?.preferred_currency || !profile?.notify_channel;
    target = nextUrl(url, incomplete ? "/onboarding" : nextParam);
    res.headers.set("Location", target.toString());
  }

  // 4) Explicitly set BOTH cookie pairs directly on the final redirect
  const base = cookieBaseFromReqOrUrl(req, process.env.NEXT_PUBLIC_SUPABASE_URL!);
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  if (accessToken) {
    res.cookies.set({
      name: `${base}-auth-token.0`,
      value: `base64-${Buffer.from(JSON.stringify({ access_token: accessToken })).toString("base64url")}`,
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
    });
    res.cookies.set({
      name: `${base}-auth-token.1`,
      value: Buffer.from("fields=email,first_name,last_name,full_name,avatar_url,provider,provider_id").toString("base64url"),
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
    });
  }
  if (refreshToken) {
    res.cookies.set({
      name: `${base}-refresh-token.0`,
      value: `base64-${Buffer.from(JSON.stringify({ refresh_token: refreshToken })).toString("base64url")}`,
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
    });
    res.cookies.set({
      name: `${base}-refresh-token.1`,
      value: Buffer.from("fields=email,first_name,last_name,full_name,avatar_url,provider,provider_id").toString("base64url"),
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
    });
  }

  // 5) Clean up PKCE verifier cookie if present
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
