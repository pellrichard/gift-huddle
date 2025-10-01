// app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { cookies as nextCookies } from "next/headers";
import {
  createServerClient,
  type CookieOptions,
  type CookieMethodsServer,
  type CookieMethodsServerDeprecated,
} from "@supabase/ssr";

function safeNext(url: URL, nextParam: string | null) {
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/account";
  return new URL(next, url.origin);
}

function cookieBaseNameFromUrl(supabaseUrl: string) {
  const existing = nextCookies().getAll().find(c => c.name.startsWith("sb-"));
  if (existing) return existing.name.split("-").slice(0, 2).join("-"); // e.g., 'sb-kzcfryzzxxzyoizlehse'
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

  // Build a cookies adapter compatible with both SSR cookie method shapes
  const adapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieOptions): void {
      cookieStore.set({ name, value, ...(options ?? {}) });
    },
    remove(
      name: string,
      valueOrOptions?: string | CookieOptions,
      maybeOptions?: CookieOptions
    ): void {
      const opts: CookieOptions | undefined =
        typeof valueOrOptions === "object" && valueOrOptions !== null
          ? valueOrOptions
          : maybeOptions;
      cookieStore.set({ name, value: "", ...(opts ?? {}), maxAge: 0 });
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: adapter,
      cookieEncoding: "base64url",
    }
  );

  if (!code) return res;

  // 1) Exchange the code for a session
  await supabase.auth.exchangeCodeForSession(code);

  // 2) Read the tokens
  const { data: sess } = await supabase.auth.getSession();
  const accessToken = sess?.session?.access_token;
  const refreshToken = sess?.session?.refresh_token;

  // 3) Compute cookie base name
  const base = cookieBaseNameFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!);

  // 4) Set BOTH cookie pairs directly on the final redirect response
  const now = Date.now();
  const inOneYear = new Date(now + 365*24*60*60*1000);

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

  // Update Location (to ensure any query params we might add later are respected)
  res.headers.set("Location", target.toString());

  return res;
}
