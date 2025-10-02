// Supabase SSR clients for Next.js 15 (robust RSC cookie reads, no `any`)
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cookie defaults (can be overridden by env)
// If you deploy on a subdomain like www., set AUTH_COOKIE_DOMAIN=.gift-huddle.com
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN || undefined;
const COOKIE_BASE: Partial<CookieOptions> = {
  path: "/",
  sameSite: "lax",
  secure: true,
  domain: COOKIE_DOMAIN,
};

// ---- helpers ----
type CookieStoreRW = {
  get(name: string): { name: string; value: string } | undefined;
  set(init: { name: string; value: string } & Partial<CookieOptions>): void;
};

function asRW(x: unknown): CookieStoreRW | null {
  if (typeof x !== "object" || x === null) return null;
  const obj = x as Record<string, unknown>;
  const hasGet = typeof (obj["get"]) === "function";
  const hasSet = typeof (obj["set"]) === "function";
  return hasGet && hasSet ? (x as CookieStoreRW) : null;
}

// Server Components: **read-only** cookies, do not assume `.set` exists
export function createServerComponentClient() {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        const store = cookies() as unknown as { get?: (n: string) => { value?: string } | undefined };
        return typeof store.get === "function" ? store.get(name)?.value : undefined;
      },
      set(): void {},
      remove(): void {},
    },
  });
}

// Server Actions: **read/write**
export function createServerActionClient() {
  const rw = asRW(cookies() as unknown);

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return rw?.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions): void {
        rw?.set({ name, value, ...(COOKIE_BASE), ...(options ?? {}) });
      },
      remove(name: string, options?: CookieOptions): void {
        rw?.set({ name, value: "", ...(COOKIE_BASE), ...(options ?? {}), maxAge: 0 });
      },
    },
  });
}

// Route Handlers: **read/write**
export function createRouteHandlerClient() {
  const rw = asRW(cookies() as unknown);

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return rw?.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions): void {
        rw?.set({ name, value, ...(COOKIE_BASE), ...(options ?? {}) });
      },
      remove(name: string, options?: CookieOptions): void {
        rw?.set({ name, value: "", ...(COOKIE_BASE), ...(options ?? {}), maxAge: 0 });
      },
    },
  });
}
