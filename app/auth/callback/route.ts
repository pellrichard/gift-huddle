import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

type SupaCookieOptions = {
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

// Cookie adapter expected by `@supabase/ssr` (CookieMethodsServer)
function cookieMethods(cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>) {
  return {
    getAll() {
      return cookieStore.getAll().map(c => ({ name: c.name, value: c.value }));
    },
    setAll(cookies: { name: string; value: string; options: SupaCookieOptions }[]) {
      cookies.forEach(({ name, value, options }) => {
        cookieStore.set({ name, value, ...options });
      });
    },
  };
}


export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/account';

  const store = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethods(store),
    }
  );

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(new URL(next, url), { status: 303 });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const res = NextResponse.redirect(new URL('/login?error=exchange_failed', url), { status: 303 });
      res.headers.set('X-OAuth-Error', message);
      return res;
    }
  }
  return NextResponse.redirect(new URL('/login?error=missing_code', url), { status: 303 });
}
