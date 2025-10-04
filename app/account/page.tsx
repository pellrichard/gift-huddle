import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";
import AccountDashboard from "@/components/account/AccountDashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountPage() {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const displayName =
    (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
    user.email?.split("@")[0] ||
    "Friend";
  const avatarUrl =
    (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) ||
    null;

  return <AccountDashboard user={{ name: displayName, avatar: avatarUrl }} />;
}
