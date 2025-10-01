// app/account/page.tsx
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function decodeBase64Url(b64u: string): string {
  // Strip optional "base64-" prefix
  const raw = b64u.startsWith("base64-") ? b64u.slice(7) : b64u;
  // Convert base64url -> base64
  const base64 = raw.replace(/-/g, "+").replace(/_/g, "/");
  // Pad
  const pad = base64.length % 4 === 2 ? "==" : base64.length % 4 === 3 ? "=" : "";
  return Buffer.from(base64 + pad, "base64").toString("utf8");
}

function getCookieValue(name: string): string | null {
  const jar = cookies();
  const c = jar.get(name)?.value ?? null;
  return c;
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

export default async function AccountPage() {
  const supabase = createServerSupabase();

  // First attempt: normal SSR session
  let { data: { session }, error } = await supabase.auth.getSession();

  // Fallback: if no session but cookies exist, reconstruct
  if (!session) {
    // discover cookie prefix (sb-...)
    const jar = cookies();
    const anySb = jar.getAll().find(c => c.name.startsWith("sb-") && c.name.includes("-auth-token.0"));
    const prefix = anySb ? anySb.name.split("-auth-token.0")[0] : null;

    if (prefix) {
      const { access_token, refresh_token } = readSupabaseTokens(prefix);
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        // try again
        const res2 = await supabase.auth.getSession();
        session = res2.data.session;
      }
    }
  }

  if (!session) {
    // Still no session -> go to login
    redirect("/login");
  }

  // Example: profile completeness gate (optional)
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_currency, notify_channel")
    .eq("id", session.user.id)
    .single();

  if (!profile?.preferred_currency || !profile?.notify_channel) {
    redirect("/onboarding");
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="text-gray-600 mt-1">Signed in as <strong>{session.user.email ?? "(no email)"}</strong></p>
    </main>
  );
}
