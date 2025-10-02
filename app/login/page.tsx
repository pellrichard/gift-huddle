// Login page with branded OAuth buttons and fixed width container (73rem)
import "server-only";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildRelativeAuthLink(provider: string, next: string) {
  const qs = new URLSearchParams({ provider, next }).toString();
  return `/auth/signin?${qs}`;
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3 0-5.4-2.5-5.4-5.4S9 6.6 12 6.6c1.7 0 2.8.7 3.5 1.3l2.4-2.4C16.7 3.7 14.6 3 12 3 6.9 3 2.7 7.2 2.7 12.3S6.9 21.6 12 21.6c6 0 9.9-4.2 9.9-10.1 0-.7-.1-1.2-.2-1.8H12z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M16.365 1.43c0 1.14-.46 2.2-1.19 2.97-.76.8-2.03 1.41-3.22 1.33-.14-1.09.41-2.26 1.17-3.04.76-.8 2.12-1.39 3.24-1.46.05.07.05.13.05.2M20.7 17.37c-.64 1.49-1.41 2.94-2.53 4.36-1 .13-1.99.39-3.03.39-1.33 0-1.99-.39-3.26-.39s-1.92.39-3.1.39c-1.05 0-2.03-.26-3.11-.79-1.05-1.41-1.94-2.92-2.53-4.43-.6-1.62-.91-3.21-.91-4.75 0-1.99.56-3.62 1.68-4.91.94-1.12 2.23-1.76 3.86-1.83 1.02-.06 2.13.33 3.34 1.16.76.52 1.65.52 2.47 0 1.15-.79 2.22-1.16 3.2-1.16h.18c1.71.07 3.04.67 3.95 1.83 1.12 1.36 1.68 3.02 1.68 4.95 0 1.59-.33 3.21-.97 4.74z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.95v-7.04H7.9v-2.9h2.4v-2.2c0-2.37 1.42-3.69 3.6-3.69 1.04 0 2.13.18 2.13.18v2.33h-1.21c-1.19 0-1.56.74-1.56 1.5v1.88h2.66l-.43 2.9h-2.23v7.04c4.78-.77 8.44-4.93 8.44-9.95z"/>
    </svg>
  );
}

type LoginPageProps = { searchParams?: Record<string, string | string[]> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nextParam = typeof searchParams?.next === "string" ? (searchParams!.next as string) : "/account";

  const googleHref = buildRelativeAuthLink("google", nextParam);
  const appleHref = buildRelativeAuthLink("apple", nextParam);
  const facebookHref = buildRelativeAuthLink("facebook", nextParam);

  return (
    <main className="mx-auto max-w-[73rem] px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">Login</h1>

      {user ? (
        <div className="p-4 border rounded bg-green-50 text-green-800 mb-6">
          You are already signed in as <strong>{user.email}</strong>.
          <div className="mt-3">
            <a href={nextParam || "/account"} className="inline-flex items-center gap-2 border rounded px-4 py-2">
              Continue to your account
            </a>
          </div>
        </div>
      ) : null}

      <div className="space-y-3 max-w-sm">
        <a href={googleHref} className="w-full inline-flex items-center justify-center gap-2 rounded px-4 py-2 border bg-white hover:bg-gray-50">
          <GoogleIcon /> Continue with Google
        </a>

        <a href={appleHref} className="w-full inline-flex items-center justify-center gap-2 rounded px-4 py-2 border bg-black text-white hover:opacity-90">
          <AppleIcon /> Continue with Apple
        </a>

        <a href={facebookHref} className="w-full inline-flex items-center justify-center gap-2 rounded px-4 py-2 border bg-[#1877F2] text-white hover:opacity-90">
          <FacebookIcon /> Continue with Facebook
        </a>
      </div>

      <p className="text-sm opacity-70 mt-4">
        You&apos;ll be redirected to your provider, then back to your account.
      </p>
    </main>
  );
}
