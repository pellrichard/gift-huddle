'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const syncProfile = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error || !sessionData.session) {
        console.warn('No session found');
        return setLoading(false);
      }

      const session = sessionData.session;
      setSession(session);

      const user = session.user;
      const email = user.email!;
      const fullName = user.user_metadata.full_name || user.user_metadata.name;
      const avatarUrl = user.user_metadata.avatar_url || user.user_metadata.picture;
      const provider = user.app_metadata.provider;

      // Insert or update profile
      const { data: profile, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
          provider,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) {
        console.error('[Account] Profile upsert error:', upsertError);
        return;
      }

      // Check if missing fields
      if (!profile.date_of_birth) {
        setShowEditModal(true);
      }

      if (!profile.currency) {
        try {
          const locale = Intl.DateTimeFormat().resolvedOptions().locale;
          const region = locale.split('-')[1] || 'US';
          const { data: fx } = await supabase
            .from('fx_rates')
            .select('currency')
            .eq('country_code', region)
            .maybeSingle();

          if (fx?.currency) {
            await supabase
              .from('profiles')
              .update({ currency: fx.currency })
              .eq('id', user.id);
          }
        } catch {
          console.warn('Could not set default currency');
        }
      }

      setLoading(false);
    };

    syncProfile();
  }, [supabase]);

  if (loading) {
    return <main className="p-4 text-gray-500">Loading session...</main>;
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Account</h1>
      {showEditModal && (
        <div className="p-4 bg-yellow-100 border rounded shadow">
          ⚠️ Please complete your profile (Date of Birth missing)
        </div>
      )}
      <pre className="bg-gray-100 text-sm p-4 rounded mt-4">
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}
