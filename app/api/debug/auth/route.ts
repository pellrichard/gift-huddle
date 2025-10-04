import { NextResponse } from 'next/server';
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


export async function GET() {
  if (process.env.NODE_ENV === 'production') { return new Response('Not available in production', { status: 404 }); }

  const store = await cookies();
  const names = ['sb-access-token', 'sb-refresh-token', 'sb-provider'];
  const presentSet = new Set(store.getAll().map(c => c.name));
  const present = Object.fromEntries(names.map(n => [n, presentSet.has(n)]));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethods(store),
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  return NextResponse.json({ present, user, error: error?.message ?? null });
}
