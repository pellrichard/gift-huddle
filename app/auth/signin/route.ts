import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Provider } from '@supabase/supabase-js';

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
  const providerParam = url.searchParams.get('provider') as Provider | null;
  const next = url.searchParams.get('next') || '/account';

  if (!providerParam) {
    return new NextResponse('Missing provider', { status: 400 });
  }

  const redirectTo = `${url.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const store = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethods(store),
    }
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: providerParam,
    options: {
      redirectTo,
      queryParams: { flow_type: 'pkce' },
      skipBrowserRedirect: true,
    },
  });

  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message ?? 'Failed to start OAuth' }, { status: 400 });
  }

  return NextResponse.redirect(data.url, { status: 303 });
}
