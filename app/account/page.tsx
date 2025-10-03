import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";
import AccountClient from "@/components/account/AccountClient";

export const runtime = "nodejs";

export default async function AccountPage() {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Optionally fetch profile later; for now show a simple, reliable page
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Your account</h1>
        <p className="text-sm text-gray-600">Signed in as <span className="font-medium">{user.email}</span></p>
      </header>

      <div className="rounded border bg-gray-50 p-3 overflow-x-auto text-xs">
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      {/* Keep your client UI mounted if it exists */}
      <AccountClient />
    </section>
  );
}
