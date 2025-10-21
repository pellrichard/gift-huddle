'use client';
import { supabase } from '@/lib/supabase/browser';

export default function PKCEDebugButton() {
  const startLogin = async () => {
    console.log('[PKCE] Initiating Google login...');

    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.gift-huddle.com/auth/oauth'
      }
    });

    const codeVerifier = localStorage.getItem('sb-code-verifier');
    console.log('[PKCE] signInWithOAuth result:', result);
    console.log('[PKCE] Stored code_verifier in localStorage:', codeVerifier);
    console.log('[PKCE] document.cookie:', document.cookie);
  };

  return (
    <button onClick={startLogin}>
      🚀 Start Google OAuth (PKCE Trace)
    </button>
  );
}
