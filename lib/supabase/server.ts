// Safe Supabase SSR clients for Next.js 15
// Back-compat exports included to satisfy existing imports/usages.

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type CookieStore = {
  get(name: string): { name: string; value: string } | undefined;
  set(init: { name: string; value: string } & Partial<CookieOptions>): void;
};

function asCookieStore(x: unknown): CookieStore | null {
  // Narrow unknown to object with get/set
  if (x && typeof x === "object" && "get" in x && "set" in x) {
    return x as CookieStore;
  }
  return null;
}

// ---------------- New, explicit factories ----------------

export function createServerComponentClient() {
  const raw = cookies() as unknown;
  const cookieStore = asCookieStore(raw);

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore?.get(name)?.value;
      },
      set(): void {},
      remove(): void {},
    },
  });
}

export function createServerActionClient() {
  const raw = cookies() as unknown;
  const c = asCookieStore(raw);

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return c?.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions): void {
        c?.set({ name, value, ...(options ?? {}) });
      },
      remove(name: string, options?: CookieOptions): void {
        c?.set({ name, value: "", ...(options ?? {}), maxAge: 0 });
      },
    },
  });
}

export function createRouteHandlerClient() {
  const raw = cookies() as unknown;
  const c = asCookieStore(raw);

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return c?.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions): void {
        c?.set({ name, value, ...(options ?? {}) });
      },
      remove(name: string, options?: CookieOptions): void {
        c?.set({ name, value: "", ...(options ?? {}), maxAge: 0 });
      },
    },
  });
}

// ---------------- Back-compat shims ----------------

export function createClient(..._args: unknown[]) {
  void _args;
  return createRouteHandlerClient();
}

export function createRouteHandlerSupabase(..._args: unknown[]) {
  void _args;
  return createRouteHandlerClient();
}

export function createServerSupabase(..._args: unknown[]) {
  void _args;
  return createServerComponentClient();
}
