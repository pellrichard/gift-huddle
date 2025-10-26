'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      router.replace('/login?error=missing-code');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('[OAuth] Exchange failed:', error.message);
        router.replace('/login?error=auth');
      } else {
        router.replace('/account');
      }
    });
  }, [searchParams, router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-gray-500">Finishing sign in…</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
