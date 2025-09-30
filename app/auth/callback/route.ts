import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/account';

  // Prepare a response we can attach cookies to
  const res = NextResponse.redirect(new URL(next, url.origin));

  // Create a Supabase server client that reads from the incoming request cookies
  // and WRITES auth cookies to the response (this is critical).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        }
      }
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(url);
  if (error) {
    // Propagate a user-visible reason (account page will toast it if present)
    const clean = new URL(next, url.origin);
    clean.searchParams.set('link_error', encodeURIComponent(error.message));
    res = NextResponse.redirect(clean);
  }

  return res;
}
