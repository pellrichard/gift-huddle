// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions, type CookieMethodsServer, type CookieMethodsServerDeprecated } from "@supabase/ssr";

interface CookieStoreShape {
  get(name: string): { value: string } | undefined;
  set(init: { name: string; value: string } & CookieOptions): void;
}
interface CookieStoreFn {
  (): CookieStoreShape;
}

export function createServerSupabase() {
  const store = (cookies as unknown as CookieStoreFn)();

  const adapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return store.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieOptions): void {
      // Pass-through EXACT options from Supabase without adding defaults.
      // Supabase sets correct flags per cookie (auth vs refresh).
      store.set({ name, value, ...(options ?? {}) });
    },
    remove(name: string, valueOrOptions?: string | CookieOptions, maybeOptions?: CookieOptions): void {
      // Pass-through remove options as well.
      const opts: CookieOptions | undefined =
        typeof valueOrOptions === "object" && valueOrOptions !== null
          ? valueOrOptions
          : maybeOptions;
      store.set({ name, value: "", ...(opts ?? {}), maxAge: 0 });
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: adapter,
      cookieEncoding: "base64url",
    }
  );
}
