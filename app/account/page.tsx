import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import PreferencesForm from './PreferencesForm';

export const metadata = { title: 'Account | Gift Huddle' };

type ProfileRow = {
  email: string | null;
  display_name: string | null;
  preferred_currency: string | null;
  notify_channel: 'email' | 'push' | 'none' | null;
  categories: {
    interests?: {
      [k: string]: boolean | undefined;
      tech?: boolean;
      fashion?: boolean;
      beauty?: boolean;
      home?: boolean;
      toys?: boolean;
    };
    budget_monthly?: number | null;
    sizes?: { clothing?: string | null; shoes?: string | null } | null;
  } | null;
};

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'email, display_name, preferred_currency, notify_channel, categories'
    )
    .eq('id', session.user.id)
    .single<ProfileRow>();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-10">
      <section>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-sm text-gray-600">
          Signed in as{' '}
          <span className="font-medium">
            {profile?.email ?? session.user.email}
          </span>
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Manage preferences</h2>
        <PreferencesForm
          preferred_currency={profile?.preferred_currency ?? undefined}
          notify_channel={profile?.notify_channel ?? undefined}
          categories={profile?.categories ?? undefined}
        />
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Connected accounts</h2>
        <ul className="list-disc pl-4 text-sm text-gray-700">
          {(session.user.identities || []).map((id) => (
            <li key={id.identity_id}>{id.provider}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Security</h2>
        <form action="/logout" method="POST">
          <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
            Log out of this device
          </button>
        </form>
      </section>
    </main>
  );
}
