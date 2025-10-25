'use client';
import { supabase } from '@/lib/supabase/browser';

type PKCEOptions = { flowType: 'pkce' };

export default function PKCEDebugButton() {
  const login = async () => {
    console.log('[PKCE Button] Initiating Google login with PKCE flow...');

    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.gift-huddle.com/auth/oauth',
        ...( { flowType: 'pkce' } as PKCEOptions )
      }
    });

    console.log('[PKCE Button] signInWithOAuth result:', result);
    console.log('[PKCE Button] localStorage code_verifier:', localStorage.getItem('sb-code-verifier'));
  };

  return (
    <button onClick={login}>
      Start Google OAuth with PKCE
    </button>
  );
}
