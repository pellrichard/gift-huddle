'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const verifier = localStorage.getItem('sb-code-verifier');

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
      if (data.access_token) {
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        });
        router.replace('/account');
      } else {
        console.error('[OAuth] Failed to retrieve access token', data);
        router.replace('/login?error=auth_fail');
      }
    });
  }, [router]);

  return <p>Finalizing secure login...</p>;
}
