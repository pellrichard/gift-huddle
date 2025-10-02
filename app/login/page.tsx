// Login page with OAuth buttons that call /auth/signin route.
// No auto-redirect to avoid redirect loops; if a session exists, render a 'Continue to account' link.
import "server-only";
import { createServerComponentClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildRelativeAuthLink(provider: string, next: string) {
  const qs = new URLSearchParams({ provider, next }).toString();
  return `/auth/signin?${qs}`;
}

export default async function LoginPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nextParam = typeof searchParams?.next === "string" ? (searchParams!.next as string) : "/account";

  const googleHref = buildRelativeAuthLink("google", nextParam);
  const appleHref = buildRelativeAuthLink("apple", nextParam);
  const facebookHref = buildRelativeAuthLink("facebook", nextParam);

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Login</h1>

      {user ? (
        <div className="p-3 border rounded bg-green-50 text-green-800">
          You are already signed in as <strong>{user.email}</strong>.
          <div className="mt-3">
            <Link href={nextParam || "/account"} className="inline-block border rounded px-4 py-2">
              Continue to your account
            </Link>
          </div>
        </div>
      ) : null}

      <div className="space-y-3 max-w-sm">
        <a href={googleHref} className="block text-center border rounded px-4 py-2">Continue with Google</a>
        <a href={appleHref} className="block text-center border rounded px-4 py-2">Continue with Apple</a>
        <a href={facebookHref} className="block text-center border rounded px-4 py-2">Continue with Facebook</a>
      </div>

      <p className="text-sm opacity-70">
        You&apos;ll be redirected to your provider, then back to your account.
      </p>
    </main>
  );
}
