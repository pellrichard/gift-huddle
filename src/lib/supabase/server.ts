// src/lib/supabase/server.ts (lint-safe cookies() usage for Next 15)
import { cookies as nextCookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  createServerClient,
  type CookieMethodsServer,
  type CookieMethodsServerDeprecated,
  type CookieOptions,
} from "@supabase/ssr";
import type { Database } from "./types";

// Define a minimal cookie store interface and a function type
// that matches the runtime behavior we rely on.
interface CookieStoreShape {
  get(name: string): { value: string } | undefined;
  set(init: { name: string; value: string } & CookieOptions): void;
}
type CookieStoreFn = () => CookieStoreShape;

// Helper to obtain a cookie store with a narrow, sync-like interface.
// We intentionally cast here to bridge the typings difference in Next 15.
function cookieStore(): CookieStoreShape {
  const fn = nextCookies as unknown as CookieStoreFn;
  return fn();
}

/**
 * Server Component / RSC-friendly client (and default route-handler reader).
 * Back-compat: `createClient()` exported to match existing imports.
 */
export function createServerSupabase() {
  const adapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return cookieStore().get(name)?.value;
    },
    set(name: string, value: string, options?: CookieOptions): void {
      cookieStore().set({ name, value, ...(options ?? {}) });
    },
    remove(name: string, valueOrOptions?: string | CookieOptions, maybeOptions?: CookieOptions): void {
      const opts: CookieOptions | undefined =
        typeof valueOrOptions === "object" && valueOrOptions !== null
          ? valueOrOptions
          : maybeOptions;
      cookieStore().set({ name, value: "", ...(opts ?? {}), maxAge: 0 });
    },
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: adapter, cookieEncoding: "base64url" }
  );
}

/** Back-compat alias used by existing route handlers. */
export function createClient() {
  return createServerSupabase();
}

/**
 * Route Handler / API-friendly client that can WRITE cookies to the response.
 * Use in routes that mutate auth or should refresh cookies explicitly.
 */
export function createRouteHandlerSupabase(req: NextRequest, res: NextResponse) {
  const adapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
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

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: adapter, cookieEncoding: "base64url" }
  );
}
