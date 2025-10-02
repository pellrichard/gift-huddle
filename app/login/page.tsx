import "server-only";
import { redirect } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";
import LoginProviderButtons from "@/components/LoginProviderButtons";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getEnabledProviders } from "@/lib/auth/providers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoginPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const next = typeof searchParams?.next === "string" ? searchParams.next : "/account";

  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    redirect(next || "/account");
  }

  const providers: Provider[] = getEnabledProviders();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-3">Sign in</h1>
      <p className="text-gh-muted mb-8">Choose a provider to continue.</p>
      <LoginProviderButtons providers={providers} next={next} />
    </main>
  );
}
