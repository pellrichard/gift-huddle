// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions, type CookieMethodsServer, type CookieMethodsServerDeprecated } from "@supabase/ssr";

type CookieSameSite = "lax" | "strict" | "none";
interface CookieOptsLite {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: CookieSameSite;
  maxAge?: number;
}

export function createServerSupabase() {
  const cookieStore = cookies();

  const cookiesAdapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieOptions | CookieOptsLite): void {
      const opts: CookieOptsLite | undefined = options ? { ...options } : undefined;
      cookieStore.set({ name, value, ...(opts ?? {}) });
    },
    remove(name: string, valueOrOptions?: string | CookieOptions | CookieOptsLite, maybeOptions?: CookieOptions | CookieOptsLite): void {
      const opts: CookieOptsLite | undefined =
        typeof valueOrOptions === "object" && valueOrOptions !== null
          ? { ...valueOrOptions }
          : maybeOptions
          ? { ...maybeOptions }
          : undefined;
      cookieStore.set({ name, value: "", ...(opts ?? {}), maxAge: 0 });
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookiesAdapter }
  );
}
