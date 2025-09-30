'use client';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginButtons() {
  const handle = async (provider: 'google'|'facebook'|'apple') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.gift-huddle.com';
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?next=/account`
      }
    });
  };

  return (
    <div className="space-y-3">
      <button onClick={() => handle('google')}   className="px-4 py-2 rounded-xl shadow">Continue with Google</button>
      <button onClick={() => handle('facebook')} className="px-4 py-2 rounded-xl shadow">Continue with Facebook</button>
      <button onClick={() => handle('apple')}    className="px-4 py-2 rounded-xl shadow">Continue with Apple</button>
    </div>
  );
}
