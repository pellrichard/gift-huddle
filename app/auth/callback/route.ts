// app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { cookies as nextCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function safeNext(url: URL, nextParam: string | null) {
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/account";
  return new URL(next, url.origin);
}

function cookieBaseNameFromUrl(supabaseUrl: string) {
  // Matches how ssr names the cookie base: 'sb-' + url host without scheme + 5-char hash
  // We can't compute the hash here, so we derive from any existing cookie that starts with 'sb-'.
  // Fallback to 'sb' base (Supabase will accept names we set); account page reads by prefix.
  const fromJar = nextCookies().getAll().find(c => c.name.startsWith("sb-"));
  if (fromJar) return fromJar.name.split("-").slice(0, 2).join("-"); // e.g., 'sb-kzcfryzzxxzyoizlehse'
  // very conservative fallback
  const host = new URL(supabaseUrl).hostname.replaceAll(".", "");
  return `sb-${host.slice(0,20)}`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const target = safeNext(url, nextParam);

  const res = NextResponse.redirect(target);

  const cookieStore = nextCookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...(options ?? {}) }); },
        remove(name: string, options?: any) { cookieStore.set({ name, value: "", ...(options ?? {}), maxAge: 0 }); },
      },
      cookieEncoding: "base64url",
    }
  );

  if (!code) return res;

  // Exchange code for session (should set cookies internally; but if platform strips them we'll set explicitly below)
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  // Get session (access + refresh) to set our own cookies if needed
  const { data: sess } = await supabase.auth.getSession();
  const accessToken = sess?.session?.access_token ?? data?.session?.access_token;
  const refreshToken = sess?.session?.refresh_token ?? data?.session?.refresh_token;

  const base = cookieBaseNameFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  const now = new Date();
  const inOneYear = new Date(now.getTime() + 365*24*60*60*1000);

  // Explicitly set both cookies on the redirect response with secure flags
  if (accessToken) {
    res.cookies.set({
      name: `${base}-auth-token.0`,
      value: `base64-${Buffer.from(JSON.stringify({ access_token: accessToken })).toString("base64url")}`,
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires: inOneYear,
    });
    res.cookies.set({
      name: `${base}-auth-token.1`,
      value: Buffer.from("fields=email,first_name,last_name,full_name,avatar_url,provider,provider_id").toString("base64url"),
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires: inOneYear,
    });
  }
  if (refreshToken) {
    res.cookies.set({
      name: `${base}-refresh-token.0`,
      value: `base64-${Buffer.from(JSON.stringify({ refresh_token: refreshToken })).toString("base64url")}`,
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires: inOneYear,
    });
    res.cookies.set({
      name: `${base}-refresh-token.1`,
      value: Buffer.from("fields=email,first_name,last_name,full_name,avatar_url,provider,provider_id").toString("base64url"),
      httpOnly: true, secure: true, sameSite: "lax", path: "/", expires: inOneYear,
    });
  }

  // add minimal diag
  const names = (res.headers.get("set-cookie") || "")
    .split(/,(?=[^;]+?=)/)
    .map(s => s.split(";")[0].split("=")[0].trim())
    .filter(Boolean)
    .slice(0, 8)
    .join(",");
  res.headers.set("Location", target.toString());
  res.headers.set("x-gh-set-cookie-count", String((res.headers.get("set-cookie") || "").split(/,(?=[^;]+?=)/).filter(Boolean).length));
  return res;
}
