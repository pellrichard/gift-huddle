import { redirect } from 'next/navigation';
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
  if (!user) redirect('/login');

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Your account</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}
