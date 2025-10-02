// app/account/page.tsx
import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProfileGate = { categories: string[] | null; preferred_shops: string[] | null };

export default async function AccountPage() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("categories, preferred_shops")
    .eq("id", session.user.id)
    .single();

  const profile = (profileRaw ?? null) as ProfileGate | null;
  const needsOnboarding =
    !(profile?.categories && profile.categories.length > 0) ||
    !(profile?.preferred_shops && profile.preferred_shops.length > 0);

  if (needsOnboarding) {
    redirect("/onboarding");
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="text-gray-600 mt-1">
        Signed in as <strong>{session!.user.email ?? "(no email)"}</strong>
      </p>

      <div className="mt-8">
        <a
          href="/onboarding?edit=1"
          className="inline-flex items-center rounded-2xl px-4 py-2 border font-medium shadow-sm"
        >
          Manage preferences
        </a>
      </div>
    </main>
  );
}
