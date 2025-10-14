import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const COOKIE_BASE: Partial<CookieOptions> = {
  path: "/",
  sameSite: "lax",
  secure: true,
};

async function buildClient() {
  const store = await cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        store.set({ name, value, ...(COOKIE_BASE), ...(options ?? {}) });
      },
      remove(name: string, options?: CookieOptions) {
        store.set({ name, value: "", ...(COOKIE_BASE), ...(options ?? {}), maxAge: 0 });
      },
    },
  });
}

// Backwards-compatible exports for pages/components vs. route handlers
export async function createServerComponentClient() {
  return buildClient();
}

export async function createRouteHandlerClient() {
  return buildClient();
}
