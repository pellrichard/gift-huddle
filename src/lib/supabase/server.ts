// src/lib/supabase/server.ts
// Unified helpers with no `next/*` imports so Turbopack stays happy in any context.

import { createClient as createBrowserClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

// Back-compat aliases expected around the codebase:
export function createServerSupabase() {
  return createClient();
}

export function supabaseServer() {
  return createServerSupabase();
}

// Minimal response-like shim (only what some call sites expect)
type ResponseShim = {
  cookies: { set: (opts: unknown) => void };
  headers: Headers;
};

// Route handler variant; returns a lightweight `res` shim to satisfy call sites.
export function createRouteHandlerSupabase(): { supabase: ReturnType<typeof createClient>; res: ResponseShim } {
  const supabase = createClient();
  const res: ResponseShim = {
    cookies: { set: () => { /* noop */ } },
    headers: new Headers(),
  };
  return { supabase, res };
}
