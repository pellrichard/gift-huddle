// Account page: SSR checks user and disables caching so fresh cookies are seen
import "server-only";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountPage() {
  const supabase = createServerComponentClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    // If the user is missing OR an auth error occurred, send them to login with next.
    redirect("/login?next=/account");
  }

  if (!user) {
    redirect("/login?next=/account");
  }

  // Minimal scaffolding; your existing account UI can render here
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your account</h1>
      <p className="opacity-80 text-sm">Welcome back, {user.email}</p>
    </main>
  );
}
