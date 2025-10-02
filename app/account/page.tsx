import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";
import AccountClient from "@/components/account/AccountClient";

export default async function AccountPage() {
  const supabase = createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
    user.email ||
    "Friend";

  const avatarUrl = (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) || null;

  return <AccountClient displayName={displayName} avatarUrl={avatarUrl} />;
}
