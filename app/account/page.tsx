
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getProfileForEdit, bootstrapProfileFromAuth } from '@/actions/profile';
import AccountDashboard from '@/components/account/AccountDashboard';

export default async function AccountPage() {
  // Ensure the profile exists/upserts from OAuth before rendering the dashboard
  await bootstrapProfileFromAuth();
  const resultUnknown: unknown = await getProfileForEdit();

  type ProfileRow = {
    id?: string;
    display_name?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    preferred_currency?: string | null;
    dob?: string | null;
    dob_show_year?: boolean | null;
    show_dob_year?: boolean | null;
    notify_mobile?: boolean | null;
    notify_email?: boolean | null;
    unsubscribe_all?: boolean | null;
    email?: string | null;
    [key: string]: unknown;
  };

  function isWrappedProfile(obj: unknown): obj is { ok: boolean; data?: unknown } {
    return typeof obj === 'object' && obj !== null
      && 'ok' in (obj as Record<string, unknown>)
      && typeof (obj as Record<string, unknown>)['ok'] === 'boolean';
  }

  let initialProfile: ProfileRow | null = null;
  if (isWrappedProfile(resultUnknown)) {
    initialProfile = (resultUnknown.ok ? (resultUnknown as { ok: boolean; data?: ProfileRow | null }).data ?? null : null);
  } else if (resultUnknown === null || typeof resultUnknown === 'object') {
    initialProfile = resultUnknown as ProfileRow | null;
  }

  const name =
    (initialProfile?.display_name ?? initialProfile?.full_name) ?? 'Friend';
  const avatar = initialProfile?.avatar_url ?? null;

  type DashboardProfile = {
    full_name: string | null;
    dob: string | null;
    show_dob_year: boolean | null;
    notify_mobile: boolean | null;
    notify_email: boolean | null;
    unsubscribe_all: boolean | null;
    preferred_currency: string | null;
    avatar_url: string | null;
    email: string | null;
  };

  const dashboardProfile: DashboardProfile | undefined = initialProfile ? {
    full_name: (initialProfile.full_name as string | null) ?? (initialProfile.display_name as string | null) ?? null,
    dob: (initialProfile.dob as string | null) ?? null,
    show_dob_year: (initialProfile.show_dob_year as boolean | null) ?? (initialProfile.dob_show_year as boolean | null) ?? null,
    notify_mobile: (initialProfile.notify_mobile as boolean | null) ?? null,
    notify_email: (initialProfile.notify_email as boolean | null) ?? null,
    unsubscribe_all: (initialProfile.unsubscribe_all as boolean | null) ?? null,
    preferred_currency: (initialProfile.preferred_currency as string | null) ?? null,
    avatar_url: (initialProfile.avatar_url as string | null) ?? null,
    email: (initialProfile.email as string | null) ?? null,
  } : undefined;

  return (
    <AccountDashboard
      user={{ name, avatar }}
      initialProfile={dashboardProfile}
    />
  );
}
