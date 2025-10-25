'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    if (!code) {
      console.error('[OAuth] Missing code in query.');
      router.replace('/login?error=missing_code');
      return;
    }

    console.log('[OAuth] Found code:', code);

    supabase.auth.exchangeCodeForSession(code).then(async ({ error }) => {
      if (error) {
        console.error('[OAuth] exchangeCodeForSession failed:', error.message);
        router.replace('/login?error=auth_exchange');
      } else {
        console.log('[OAuth] Exchange succeeded. Checking session...');
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session) {
          console.log('[OAuth] Session active. Redirecting to /account.');
          router.replace('/account');
        } else {
          console.warn('[OAuth] Session missing after exchange. Redirecting to login.');
          router.replace('/login?error=session_missing');
        }
      }
    });
  }, [router]);

  return <p>Finishing sign-in... please wait</p>;
}
