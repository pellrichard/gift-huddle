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
interface CookieStoreShape {
  get(name: string): { value: string } | undefined;
  set(init: { name: string; value: string } & CookieOptsLite): void;
}
interface CookieStoreFn {
  (): CookieStoreShape;
}

const defaultCookieOpts: CookieOptsLite = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: true,
};

export function createServerSupabase() {
  const store = (cookies as unknown as CookieStoreFn)();

  const adapter: CookieMethodsServer | CookieMethodsServerDeprecated = {
    get(name: string): string | undefined {
      return store.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieOptions | CookieOptsLite): void {
      const opts: CookieOptsLite | undefined = options ? { ...defaultCookieOpts, ...options } : defaultCookieOpts;
      store.set({ name, value, ...(opts ?? {}) });
    },
    remove(name: string, valueOrOptions?: string | CookieOptions | CookieOptsLite, maybeOptions?: CookieOptions | CookieOptsLite): void {
      const optsMerged: CookieOptsLite =
        typeof valueOrOptions === "object" && valueOrOptions !== null
          ? { ...defaultCookieOpts, ...valueOrOptions }
          : maybeOptions
          ? { ...defaultCookieOpts, ...maybeOptions }
          : { ...defaultCookieOpts };
      store.set({ name, value: "", ...optsMerged, maxAge: 0 });
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
