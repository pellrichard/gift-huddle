'use client';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const providers = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'facebook', label: 'Continue with Facebook' },
  { id: 'linkedin', label: 'Continue with LinkedIn' }
];

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/account');
    });
  }, [router]);

  const handleLogin = async (provider: 'google' | 'facebook' | 'linkedin') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'https://www.gift-huddle.com/auth/callback'
      }
    });
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Log in</h1>
      {providers.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleLogin(id as 'google' | 'facebook' | 'linkedin')}
          className="w-full flex items-center justify-center gap-3 border px-4 py-2 rounded-md mb-3 hover:bg-gray-50 transition"
        >
          <img
            src={`https://authjs.dev/img/providers/${id}.svg`}
            alt={id}
            className="w-5 h-5"
          />
          <span>{label}</span>
        </button>
      ))}
    </main>
  );
}
