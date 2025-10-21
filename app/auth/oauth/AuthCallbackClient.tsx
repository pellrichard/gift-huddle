'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function AuthCallbackClient() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    const storedVerifier = localStorage.getItem('sb-code-verifier');

    console.log('[PKCE] OAuth code from URL:', code);
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
  }, [hydrated, router]);

  return <p>Verifying login via PKCE... (waiting for hydration)</p>;
}
