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
      console.error('[OAuth] Missing code');
      router.replace('/login?error=missing_code');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(async ({ error }) => {
      if (error) {
        console.error('[OAuth] exchange failed:', error.message);
        router.replace('/login?error=exchange_fail');
        return;
      }

      // Wait and manually confirm session is available
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session) {
        console.log('[OAuth] Session established:', session);
        router.replace('/account');
      } else {
        console.warn('[OAuth] Session still missing. Stay on page.');
      }
    });
  }, [router]);

  return <p>Signing you in securely... please wait</p>;
}
