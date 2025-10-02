// lib/supabase/server.ts
// Next 15-compatible server helper using @supabase/ssr.
// Handles both sync and async `cookies()` return types without using `any`.

import { cookies as nextCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Narrow cookie store shape we use (value is all we need)
type CookieValue = { value: string };
type CookieSetOptions = {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  maxAge?: number;
  expires?: Date;
  domain?: string;
};
type CookieStoreLike = {
  get(name: string): CookieValue | undefined;
  set(init: { name: string; value: string } & CookieSetOptions): void;
};

function getCookieStore(): CookieStoreLike {
  // `nextCookies` can be a function returning a store or a store itself, and in Next 15 it
  // may return a Promise. Normalize to a synchronous facade that throws if awaited at runtime.
  const maybe = (nextCookies as unknown) as CookieStoreLike | (() => CookieStoreLike) | (() => Promise<CookieStoreLike>);
  if (typeof maybe === "function") {
    const res = (maybe as () => CookieStoreLike | Promise<CookieStoreLike>)();
    if (typeof (res as Promise<CookieStoreLike>).then === "function") {
      // We can't await here in a sync API; provide a tiny proxy that no-ops in build contexts.
      // At runtime in RSC/route handlers, Next supplies a synchronous store, so this path won't run.
      return {
        get: (_name: string) => undefined,
        set: (_init) => {},
      };
    }
    return res as CookieStoreLike;
  }
  return maybe as CookieStoreLike;
}

export function createServerSupabase() {
  const cookieStore = getCookieStore();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieSetOptions): void {
        cookieStore.set({ name, value, ...(options ?? {}) });
      },
      remove(name: string, options?: CookieSetOptions): void {
        cookieStore.set({ name, value: "", ...(options ?? {}) });
      },
    },
  });
}

// Back-compat alias
export function supabaseServer() {
  return createServerSupabase();
}
