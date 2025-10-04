import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { updateProfile } from "./actions";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountPage() {
  const supabase = createServerComponentClient();
  type DB = import('@/lib/supabase/types').Database;
type ProfileRow = DB['public']['Tables']['profiles']['Row'];
const db = (supabase as unknown as SupabaseClient<DB>);
const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Bootstrap profile row if missing (idempotent)
const { data: profileRow } = await db
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .maybeSingle();

let profile: ProfileRow | null = (profileRow as ProfileRow | null);

if (!profile) {
  type ProfilesInsert = DB['public']['Tables']['profiles']['Insert'];
  const bootstrap: ProfilesInsert = {
    id: user.id,
    display_name:
      (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || null,
    avatar_url:
      (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) || null,
  };

  await db.from('profiles').upsert(bootstrap, { onConflict: 'id' });

  const { data: refetched } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  profile = (refetched as ProfileRow | null);
}


  return (
    <section className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Your account</h1>
        <p className="text-sm text-gray-600">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
      </header>

      {/* Profile form */}
      <form action={updateProfile} className="grid gap-4 rounded border p-4">
        <div className="grid gap-1">
          <label htmlFor="display_name" className="text-sm font-medium">Display name</label>
          <input
            id="display_name"
            name="display_name"
            defaultValue={profile?.display_name ?? ""}
            className="rounded border px-3 py-2"
            placeholder="Your name"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="avatar_url" className="text-sm font-medium">Avatar URL</label>
          <input
            id="avatar_url"
            name="avatar_url"
            defaultValue={profile?.avatar_url ?? ""}
            className="rounded border px-3 py-2"
            placeholder="https://…"
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">Save changes</button>
          <span aria-live="polite" className="text-sm text-gray-500">Changes apply immediately</span>
        </div>
      </form>

      {/* Connected providers & linking (optional stub) */}
      <section className="rounded border p-4">
        <h2 className="text-lg font-semibold mb-2">Connected sign-in providers</h2>
        <p className="text-sm text-gray-600">
          Linking a second provider lets you log in with either account.
        </p>
        {/* You can wire up a richer UI in app/account/ConnectProviders.tsx later */}
      </section>

      <form action="/logout" method="post">
        <button className="rounded border px-4 py-2">Sign out</button>
      </form>
    </section>
  );
}
