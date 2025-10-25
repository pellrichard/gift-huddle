'use client';
import React from "react";
import { supabase } from '@/lib/supabase/browser';

type Provider = "google" | "facebook" | "apple";

export default function LoginButtons() {
  const handleLogin = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'https://www.gift-huddle.com/auth/oauth',
        ...( { flowType: 'pkce' } as { flowType: 'pkce' } )
      }
    });
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <button onClick={() => handleLogin("google")}>Login with Google</button>
      <button onClick={() => handleLogin("facebook")}>Login with Facebook</button>
    </div>
  );
}
