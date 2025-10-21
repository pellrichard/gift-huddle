export const dynamic = 'force-dynamic';
export const revalidate = 0;

import AccountDashboard from '@/components/account/AccountDashboard';
import { getProfileForEdit, bootstrapProfileFromAuth, listCurrenciesForUiDetailed } from '@/actions/profile';

export default async function AccountPage() {
  // Ensure the profile exists/upserts from OAuth before rendering the dashboard
  await bootstrapProfileFromAuth();

  const prof = await getProfileForEdit();
  const currencyOptionsDetailed = await listCurrenciesForUiDetailed();
  const currencyOptions = currencyOptionsDetailed.map(c => c.code);

  const name = (prof?.full_name as string | null) ?? 'Guest';
  const avatar = (prof?.avatar_url as string | null) ?? null;

  const initialProfile = prof ? {
    full_name: prof.full_name ?? null,
    dob: prof.dob ?? null,
    show_dob_year: prof.show_dob_year ?? null,
    notify_mobile: prof.notify_mobile ?? null,
    notify_email: prof.notify_email ?? null,
    unsubscribe_all: prof.unsubscribe_all ?? null,
    preferred_currency: prof.preferred_currency ?? null,
    avatar_url: prof.avatar_url ?? null,
    email: prof.email ?? null,
  } : undefined;

  return <AccountDashboard
    user={{ name, avatar }}
    initialProfile={initialProfile}
    currencyOptions={currencyOptions}
    currencyOptionsDetailed={currencyOptionsDetailed}
  />;
}
