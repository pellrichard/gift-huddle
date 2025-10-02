// Login page with dynamic OAuth providers (from env flags)
import "server-only";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getEnabledProviders, type Provider } from "@/lib/auth/providers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildRelativeAuthLink(provider: string, next: string) {
  const qs = new URLSearchParams({ provider, next }).toString();
  return `/auth/signin?${qs}`;
}

// Minimal icon set; others use a generic mark
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
      <path fill="currentColor" d="M16.365 1.43c0 1.14-.46 2.2-1.19 2.97..."/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22 12.07C22 6.48 17.52 2 11.93 2..."/>
    </svg>
  );
}
function GenericIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>
  );
}

// Relax to Partial so we don't have to specify labels for every possible Provider
const LABELS: Partial<Record<Provider, string>> = {
  google: "Continue with Google",
  apple: "Continue with Apple",
  facebook: "Continue with Facebook",
  github: "Continue with GitHub",
  gitlab: "Continue with GitLab",
  bitbucket: "Continue with Bitbucket",
  discord: "Continue with Discord",
  twitch: "Continue with Twitch",
  twitter: "Continue with Twitter",
  slack: "Continue with Slack",
  azure: "Continue with Azure AD",
  linkedin: "Continue with LinkedIn"
};

const CLASSES: Partial<Record<Provider, string>> = {
  google: "bg-white text-black hover:bg-gray-50 border",
  apple: "bg-black text-white hover:opacity-90",
  facebook: "bg-[#1877F2] text-white hover:opacity-90",
  github: "bg-black text-white hover:opacity-90",
  gitlab: "bg-[#FC6D26] text-white hover:opacity-90",
  bitbucket: "bg-[#2684FF] text-white hover:opacity-90",
  discord: "bg-[#5865F2] text-white hover:opacity-90",
  twitch: "bg-[#9146FF] text-white hover:opacity-90",
  twitter: "bg-black text-white hover:opacity-90",
  slack: "bg-white text-black hover:bg-gray-50 border",
  azure: "bg-[#0078D4] text-white hover:opacity-90",
  linkedin: "bg-[#0A66C2] text-white hover:opacity-90"
};

function IconFor(p: Provider) {
  switch (p) {
    case "google": return <GoogleIcon />;
    case "apple": return <AppleIcon />;
    case "facebook": return <FacebookIcon />;
    default: return <GenericIcon />;
  }
}

type LoginPageProps = { searchParams?: Record<string, string | string[]> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nextParam = typeof searchParams?.next === "string" ? (searchParams!.next as string) : "/account";

  const enabled = getEnabledProviders();

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
        {enabled.map((p) => {
          const href = buildRelativeAuthLink(p, nextParam);
          const label = LABELS[p] ?? `Continue with ${p}`;
          const classes = CLASSES[p] ?? "bg-white text-black hover:bg-gray-50 border";
          return (
            <a key={p} href={href} className={`w-full inline-flex items-center justify-center gap-2 rounded px-4 py-2 ${classes}`}>
              {IconFor(p)} {label}
            </a>
          );
        })}
        {enabled.length === 0 ? (
          <p className="text-sm opacity-70">No providers enabled. Ask an admin to enable at least one provider in Supabase and set NEXT_PUBLIC_AUTH_*=1 variables.</p>
        ) : null}
      </div>

      <p className="text-sm opacity-70 mt-4">
        You&apos;ll be redirected to your provider, then back to your account.
      </p>
    </main>
  );
}
