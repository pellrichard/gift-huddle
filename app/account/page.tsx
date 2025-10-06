import { getProfileForEdit, bootstrapProfileFromAuth } from '@/actions/profile';
import AccountDashboard from '@/components/account/AccountDashboard';

export default async function AccountPage() {
  // Ensure profile row exists on first hit (no flash of empty state)
  await bootstrapProfileFromAuth();
  const result = await getProfileForEdit();
  const initialProfile = result.ok ? result.data : undefined;

  const name = initialProfile?.full_name ?? 'Friend';
  const avatar = initialProfile?.avatar_url ?? null;

  return (
    <AccountDashboard
      user={{ name, avatar }}
      initialProfile={initialProfile}
    />
  );
}
