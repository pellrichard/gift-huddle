'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('[Account] Session error:', error);
      }
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <main className="p-4 text-gray-500">Loading session...</main>;
  }

  if (!session) {
    return (
      <main className="p-4 text-red-600">
        No session found. Redirecting or showing login...
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Account</h1>
      <pre className="bg-gray-100 text-sm p-4 rounded">
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}
