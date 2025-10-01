// app/onboarding/page.tsx
import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProfilePrefs = { categories: string[] | null; preferred_shops: string[] | null };

const CATEGORIES = ["tech", "fashion", "beauty", "home", "toys", "sports"];
const SHOPS = ["amazon", "argos", "johnlewis", "etsy", "nike", "apple"];

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("categories, preferred_shops")
    .eq("id", session.user.id)
    .single();

  const profile = (profileRaw ?? null) as ProfilePrefs | null;
  const isComplete =
    (profile?.categories?.length || 0) > 0 &&
    (profile?.preferred_shops?.length || 0) > 0;

  const editParam = searchParams?.edit;
  const editing = Array.isArray(editParam) ? editParam[0] === "1" : editParam === "1";

  // If profile is complete and not explicitly editing, go back to account
  if (isComplete && !editing) {
    redirect("/account");
  }

  const initialCats = Array.isArray(profile?.categories) ? profile.categories : [];
  const initialShops = Array.isArray(profile?.preferred_shops) ? profile.preferred_shops : [];

  const err = (searchParams?.err ?? "") as string;
  const msg = (searchParams?.msg ?? "") as string;
  const rid = (searchParams?.rid ?? "") as string;

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold">Finish setting up your account</h1>
      <p className="text-gray-600 mt-2">Choose interests and favourite shops.</p>

      {(err || msg || rid) && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err === "missing"
            ? "Pick at least one category and one shop."
            : "We couldn't save your choices. Please try again."}
          {msg ? <div className="mt-1 text-xs opacity-80">Details: {msg}</div> : null}
          {rid ? <div className="mt-1 text-xs opacity-60">Request ID: {rid}</div> : null}
        </div>
      )}

      <form action="/onboarding/update" method="post" className="mt-6 space-y-8">
        <div>
          <h2 className="text-lg font-medium">Categories (pick at least one)</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <input type="checkbox" name="categories" value={c} defaultChecked={initialCats.includes(c)} />
                <span className="capitalize">{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium">Preferred shops (pick at least one)</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {SHOPS.map((s) => (
              <label key={s} className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <input type="checkbox" name="preferred_shops" value={s} defaultChecked={initialShops.includes(s)} />
                <span className="capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="inline-flex items-center rounded-2xl px-4 py-2 border font-medium shadow-sm">
          Save and continue
        </button>
      </form>
    </main>
  );
}
