import { cookies as getCookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const cookieStore = await getCookies();
  const res = NextResponse.redirect(new URL('/account', request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: '', ...options });
        }
      }
    }
  );

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login?error=session', request.url));
  }

  const { user } = session;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
      provider: user.app_metadata?.provider
    });
  }

  const { data: refreshed } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!refreshed?.currency) {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const country = locale.split('-').pop();

    const { data: rate } = await supabase
      .from('fx_rates')
      .select('currency')
      .eq('country', country)
      .single();

    if (rate?.currency) {
      await supabase
        .from('profiles')
        .update({ currency: rate.currency })
        .eq('id', user.id);
    }
  }

  return res;
}
