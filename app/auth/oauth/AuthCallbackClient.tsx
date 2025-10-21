'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.replace('/login?error=missing_code');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('OAuth session error:', error.message);
        router.replace('/login?error=auth');
      } else {
        router.replace('/account');
      }
    });
  }, [searchParams, router]);

  return <p>Completing login, please wait...</p>;
}
