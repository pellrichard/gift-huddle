'use client';
import { useCallback } from 'react';
// @ts-expect-error: using internal Supabase helper
import { createPKCEVerifierChallengePair } from '@supabase/auth-js/dist/module/fetch/_pkce';

export default function ManualPKCELogin() {
  const login = useCallback(async () => {
    const { verifier, challenge } = await createPKCEVerifierChallengePair();

    localStorage.setItem('sb-code-verifier', verifier);

    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].replace('https://', '');
    const redirectTo = encodeURIComponent('https://www.gift-huddle.com/auth/oauth');

    const authorizeUrl = `https://${projectRef}.supabase.co/auth/v1/authorize?provider=google&redirect_to=${redirectTo}&response_type=code&code_challenge=${challenge}&code_challenge_method=S256`;

    window.location.href = authorizeUrl;
  }, []);

  return <button onClick={login}>Login via Manual PKCE</button>;
}
