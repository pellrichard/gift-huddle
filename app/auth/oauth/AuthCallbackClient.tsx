'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const storedVerifier = localStorage.getItem('sb-code-verifier');

    console.log('[PKCE] Returned OAuth code:', code);
    console.log('[PKCE] LocalStorage code_verifier:', storedVerifier);
    console.log('[PKCE] document.cookie:', document.cookie);

    if (!code) {
      console.error('[PKCE] Missing OAuth code');
      router.replace('/login?error=missing_code');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
      if (error) {
        console.error('[PKCE] exchangeCodeForSession error:', error.message);
        router.replace('/login?error=auth');
      } else {
        console.log('[PKCE] Session successfully exchanged:', data);
        router.replace('/account');
      }
    });
  }, [searchParams, router]);

  return <p>[PKCE] Verifying login, see browser console...</p>;
}
