'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const verifier = sessionStorage.getItem('sb-code-verifier');

    if (!code || !verifier) {
      console.error('[OAuth] Missing code or verifier');
      router.replace('/login?error=missing_code_or_verifier');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_code: code,
        code_verifier: verifier
      })
    })
    .then(res => res.json())
    .then(async data => {
      if (!data.access_token) {
        console.error('[OAuth] Token exchange failed:', data);
        router.replace('/login?error=exchange_failed');
        return;
      }

      console.log('[OAuth] Token exchange success. Setting session...');
      const { error: setError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });

      if (setError) {
        console.error('[OAuth] setSession failed:', setError.message);
        router.replace('/login?error=session_set_failed');
        return;
      }

      const { data: sessionCheck } = await supabase.auth.getSession();
      console.log('[OAuth] Session after setSession:', sessionCheck.session);

      if (sessionCheck.session) {
        router.replace('/account');
      } else {
        console.warn('[OAuth] Session still missing after setSession');
        router.replace('/login?error=session_missing_after_set');
      }
    });
  }, [router]);

  return <p>Finalizing login…</p>;
}
