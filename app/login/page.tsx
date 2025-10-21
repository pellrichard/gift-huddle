'use client';
import { supabase } from '@/lib/supabase/browser';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    console.log('[CleanLogin] Starting login...');
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.gift-huddle.com/auth/oauth'
      }
    });
    console.log('[CleanLogin] Result:', result);
  };

  return (
    <main style={{ padding: 40, textAlign: 'center' }}>
      <h1>Gift Huddle Login (Clean)</h1>
      <button
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: '#4285F4',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 16
        }}
      >
        Sign in with Google
      </button>
    </main>
  );
}
