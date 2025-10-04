import { getProfileForEdit } from '@/actions/profile';
import AccountDashboard from '@/components/account/AccountDashboard';

export default async function AccountPage() {
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
