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
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <div className="space-y-3">
        <a className="block rounded border px-4 py-2 text-center" href="/auth/signin?provider=google&next=/account">Continue with Google</a>
        <a className="block rounded border px-4 py-2 text-center" href="/auth/signin?provider=facebook&next=/account">Continue with Facebook</a>
      </div>
    </main>
  );
}
