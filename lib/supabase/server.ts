// Supabase SSR clients for Next.js 15 (typed, no explicit return types)
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type CookieStore = {
  get(name: string): { name: string; value: string } | undefined;
  set(init: { name: string; value: string } & Partial<CookieOptions>): void;
};

function asCookieStore(x: unknown): CookieStore | null {
  if (x && typeof x === "object" && "get" in x && "set" in x) {
    return x as CookieStore;
  }
  return null;
}

// Server Components: read-only cookies
export function createServerComponentClient() {
  const cookieStore = asCookieStore(cookies() as unknown);

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore?.get(name)?.value;
      },
      set(): void {},
      remove(): void {},
    },
  });
}

// Server Actions: read/write cookies
export function createServerActionClient() {
  const c = asCookieStore(cookies() as unknown);

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
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

// Route Handlers: read/write cookies
export function createRouteHandlerClient() {
  const c = asCookieStore(cookies() as unknown);

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
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
