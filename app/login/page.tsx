// Login page with OAuth buttons that call /auth/signin route
import "server-only";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildRelativeAuthLink(provider: string, next: string) {
  const qs = new URLSearchParams({ provider, next }).toString();
  return `/auth/signin?${qs}`;
}

export default async function LoginPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Determine "next" target (defaults to /account)
  const nextParam = typeof searchParams?.next === "string" ? (searchParams!.next as string) : "/account";

  if (user) {
    redirect(nextParam || "/account");
  }

  const googleHref = buildRelativeAuthLink("google", nextParam);
  const appleHref = buildRelativeAuthLink("apple", nextParam);
  const facebookHref = buildRelativeAuthLink("facebook", nextParam);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>

      <div className="space-y-3 max-w-sm">
        <a href={googleHref} className="block text-center border rounded px-4 py-2">Continue with Google</a>
        <a href={appleHref} className="block text-center border rounded px-4 py-2">Continue with Apple</a>
        <a href={facebookHref} className="block text-center border rounded px-4 py-2">Continue with Facebook</a>
      </div>

      <p className="text-sm opacity-70 mt-4">
        You&apos;ll be redirected to your provider, then back to your account.
      </p>
    </main>
  );
}
