// app/account/page.tsx
import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Minimal shape for profile gate
interface ProfileGate {
  categories: string[] | null;
  preferred_shops: string[] | null;
}

export default async function AccountPage() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select("categories, preferred_shops")
    .eq("id", session.user.id)
    .single()) as unknown as { data: ProfileGate | null };

  if (!profile?.categories?.length || !profile?.preferred_shops?.length) {
    redirect("/onboarding");
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="text-gray-600 mt-1">
        Signed in as <strong>{session!.user.email ?? "(no email)"}</strong>
      </p>
    </main>
  );
}
