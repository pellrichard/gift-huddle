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

export default async function HomePage() {
  const store = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethods(store),
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect('/account');
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <section className="rounded-2xl bg-gray-50 p-10 md:p-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Gift Huddle</h1>
        <p className="mt-4 text-gray-600 max-w-2xl">
          Collect gift ideas with friends and family. Save links, plan budgets, and avoid duplicates.
        </p>
        <div className="mt-8">
          <a
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-base font-medium shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            href="/login"
          >
            Get started
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
