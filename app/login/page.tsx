import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type SupaCookieOptions = {
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

// Adapter that matches @supabase/ssr CookieMethodsServer
function cookieMethods(
  cookieStore: Awaited<ReturnType<typeof import('next/headers').cookies>>
) {
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

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.7 0 6.3 1.6 7.7 3l5.2-5.1C33.7 4.8 29.1 3 24 3 14.8 3 6.9 8.1 3.2 15.3l6.7 5.2C11.7 14.9 17.3 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.7-.4-3.9H24v7.1h12.7c-.3 2.2-1.8 5.5-5.2 7.7l8 6.2c4.7-4.3 7-10.6 7-17.1z"/>
      <path fill="#FBBC05" d="M9.9 28.4c-.5-1.6-.8-3.3-.8-5.1s.3-3.5.8-5.1L3.2 13c-1.4 2.8-2.2 6-2.2 9.3s.8 6.5 2.2 9.3l6.7-3.2z"/>
      <path fill="#34A853" d="M24 45c6.5 0 12-2.1 16.1-5.9l-8-6.2c-2.2 1.5-5.3 2.6-8.1 2.6-6.7 0-12.3-4.3-14.1-10.1l-6.7 3.2C6.9 39.9 14.8 45 24 45z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12.07C24 5.405 18.627 0 12 0S0 5.405 0 12.07C0 18.1 4.388 23.093 10.125 24v-8.437H7.078v-3.493h3.047V9.41c0-3.01 1.792-4.668 4.532-4.668 1.312 0 2.686.235 2.686.235v2.98h-1.514c-1.492 0-1.955.93-1.955 1.887v2.26h3.328l-.532 3.493h-2.796V24C19.612 23.093 24 18.1 24 12.07z"/>
      <path fill="#fff" d="M16.875 24v-8.437h2.796l.532-3.493h-3.328v-2.26c0-.957.463-1.887 1.955-1.887h1.514V4.977s-1.374-.235-2.686-.235c-2.74 0-4.532 1.658-4.532 4.668v2.66H10.125v3.493h3.047V24h3.703z"/>
    </svg>
  );
}

export default async function Page() {
  const store = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethods(store),
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/account');

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <div className="space-y-3">
        <a
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-5 py-3 text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
          href="/auth/signin?provider=google&next=/account"
          aria-label="Continue with Google"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </a>
        <a
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-5 py-3 text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
          href="/auth/signin?provider=facebook&next=/account"
          aria-label="Continue with Facebook"
        >
          <FacebookIcon />
          <span>Continue with Facebook</span>
        </a>
      </div>
    </main>
  );
}
