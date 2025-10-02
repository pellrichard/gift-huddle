// Login page: if already authenticated, send to /account instead of re-prompting OAuth
import "server-only";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoginPage() {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/account");
  }

  // Replace with your real login UI / OAuth buttons
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <p className="opacity-80 text-sm">Choose a provider to continue.</p>
    </main>
  );
}
