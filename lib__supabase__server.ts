// Supabase SSR clients for Next.js 15 using CookieMethodsServer (getAll/setAll)
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Cookie = { name: string; value: string; options: CookieOptions };

// Map Next.js cookies() store to @supabase/ssr CookieMethodsServer
function cookieMethods(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return {
    getAll() {
      return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
    },
    setAll(cookies: Cookie[]) {
      for (const { name, value, options } of cookies) {
        cookieStore.set({ name, value, ...(options ?? {}) });
      }
    },
  };
}

export function createServerComponentClient() {
  // In RSC, cookies() is async in Next 15
  const storePromise = cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: cookieMethods((storePromise as unknown) as Awaited<ReturnType<typeof cookies>>),
  });
}
