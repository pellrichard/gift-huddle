// app/account/page.tsx
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CookieStoreShape {
  get(name: string): { value: string } | undefined;
  getAll(): { name: string; value: string }[];
}
type CookieStoreFn = () => CookieStoreShape;

function decodeBase64Url(b64u: string): string {
  const raw = b64u.startsWith("base64-") ? b64u.slice(7) : b64u;
  const base64 = raw.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 2 ? "==" : base64.length % 4 === 3 ? "=" : "";
  return Buffer.from(base64 + pad, "base64").toString("utf8");
}

function getCookieValue(name: string): string | null {
  const store = (cookies as unknown as CookieStoreFn)();
  return store.get(name)?.value ?? null;
}

function readSupabaseTokens(prefix: string) {
  const a0 = getCookieValue(`${prefix}-auth-token.0`);
  const r0 = getCookieValue(`${prefix}-refresh-token.0`);
  let access_token: string | null = null;
  let refresh_token: string | null = null;

  try {
    if (a0) {
      const text = decodeBase64Url(a0);
      const obj = JSON.parse(text);
      if (typeof obj?.access_token === "string") access_token = obj.access_token;
    }
  } catch {}
  try {
    if (r0) {
      const text = decodeBase64Url(r0);
      const obj = JSON.parse(text);
      if (typeof obj?.refresh_token === "string") refresh_token = obj.refresh_token;
    }
  } catch {}

  return { access_token, refresh_token };
}

// Minimal shape for profile gate
interface ProfileGate {
  preferred_currency: string | null;
  notify_channel: string | null;
}

export default async function AccountPage() {
  const supabase = createServerSupabase();

  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const store = (cookies as unknown as CookieStoreFn)();
    const anySb = store
      .getAll()
      .find((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token.0"));
    const prefix = anySb ? anySb.name.split("-auth-token.0")[0] : null;

    if (prefix) {
      const { access_token, refresh_token } = readSupabaseTokens(prefix);
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        const res2 = await supabase.auth.getSession();
        session = res2.data.session;
      }
    }
  }

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select("preferred_currency, notify_channel")
    .eq("id", session.user.id)
    .single()) as unknown as { data: ProfileGate | null };

  if (!profile?.preferred_currency || !profile?.notify_channel) {
    redirect("/onboarding");
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="text-gray-600 mt-1">
        Signed in as <strong>{session.user.email ?? "(no email)"}</strong>
      </p>
    </main>
  );
}
