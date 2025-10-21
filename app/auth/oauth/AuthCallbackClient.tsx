'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    console.log('[AuthDebug] OAuth code:', code);

    if (!code) {
      console.error('[AuthDebug] Missing code param');
      router.replace('/login?error=missing_code');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
      if (error) {
        console.error('[AuthDebug] exchangeCodeForSession error:', error.message);
        router.replace('/login?error=auth');
      } else {
        console.log('[AuthDebug] Session established:', data);
        router.replace('/account');
      }
    });
  }, [searchParams, router]);

  return <p>Debugging login... check the console.</p>;
}
