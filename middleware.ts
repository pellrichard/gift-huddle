// middleware.ts — Resilient SSR middleware with guards & try/catch
import { NextResponse, type NextRequest } from "next/server";
import {
  createServerClient,
  type CookieMethodsServer,
  type CookieMethodsServerDeprecated,
  type CookieOptions,
} from "@supabase/ssr";

// Only run Supabase logic for routes that need auth context.
// Everything else passes through to avoid unexpected 500s.
function needsAuth(pathname: string) {
  return pathname.startsWith("/account") || pathname.startsWith("/onboarding");
}

export async function middleware(req: NextRequest) {
  // Quick pass-through for most assets/routes (matcher also excludes many).
  if (!needsAuth(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If env vars are missing in Edge env, don't block the request.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  try {
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

    const supabase = createServerClient(url, anon, {
      cookies: adapter,
      cookieEncoding: "base64url",
    });

    // Refresh/ensure cookies are up to date if a session exists.
    const { data: { session } } = await supabase.auth.getSession();

    // Optional light guard: if hitting /account without a session, go to /login.
    if (!session && req.nextUrl.pathname.startsWith("/account")) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch {
    // Never fail closed from middleware: pass through if anything throws.
    return NextResponse.next();
  }
}

// Apply to app routes but exclude static assets and API routes.
// Keep broad, but our function narrows actual Supabase work to auth-critical paths.
export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
