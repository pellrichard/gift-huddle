// app/account/page.tsx
import "server-only";
import { cookies, headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CookieShape { getAll(): { name: string; value: string }[] }
interface HeadersShape { get(name: string): string | null }

function isPromise<T>(x: unknown): x is Promise<T> {
  return typeof x === "object" && x !== null && "then" in (x as Record<string, unknown>);
}
function hasGet(x: unknown): x is HeadersShape {
  return typeof x === "object" && x !== null && typeof (x as Record<string, unknown>)["get"] === "function";
}

function CookieDebug() {
  const jar = cookies() as unknown as CookieShape;
  const all = typeof jar.getAll === "function" ? jar.getAll() : [];
  const supa = all.filter(c => c.name.startsWith("sb-"));
  return (
    <div className="text-xs text-gray-600 mt-2">
      <div>Total cookies: {all.length}</div>
      <div>Supabase cookies: {supa.length}</div>
      <ul className="max-h-40 overflow-auto mt-1 border rounded p-2 bg-gray-50">
        {supa.map(c => (
          <li key={c.name}><code>{c.name}</code>: <em>{c.value.slice(0, 24)}…</em></li>
        ))}
      </ul>
    </div>
  );
}

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const { data: { session }, error } = await supabase.auth.getSession();

  // Support both direct Headers and a Promise<Headers> variant
  const hx = headers() as unknown;
  let url: string | null = null;
  if (hasGet(hx)) {
    url = hx.get("x-invoke-query");
  } else if (isPromise<HeadersShape>(hx)) {
    const resolved = await hx;
    url = resolved.get("x-invoke-query");
  }

  const linkDebug = new URLSearchParams(url ?? "");
  const urlDebug = Object.fromEntries(linkDebug.entries());

  if (!session) {
    return (
      <main className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-2">You’re not signed in</h1>
        <p className="text-gray-600">Please log in to view your account.</p>
        <div className="mt-4">
          <Link href="/login" className="inline-block px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600">Go to Login</Link>
        </div>
        <div className="mt-8 p-4 rounded border">
          <h2 className="font-medium">Auth debug</h2>
          <div className="text-sm mt-2">
            <div>getSession error: {error?.message ?? "none"}</div>
            {"link_error" in urlDebug ? <div>link_error: {String(urlDebug["link_error"])}</div> : null}
            {"pkce" in urlDebug ? <div>pkce: {String(urlDebug["pkce"])}</div> : null}
            {"cookies" in urlDebug ? <div>cookies (from callback): {String(urlDebug["cookies"])}</div> : null}
          </div>
          {CookieDebug()}
        </div>
      </main>
    );
  }

  const user = session.user;
  const email = user.email ?? "(no email)";
  const idents = (user.identities ?? []).map(i => i.provider).join(", ") || "password";
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="text-gray-600 mt-1">Signed in as <strong>{email}</strong></p>
      <p className="text-gray-600">Providers: {idents}</p>
      <div className="mt-6 p-4 rounded border">
        <h2 className="font-medium">Auth debug</h2>
        <div className="text-sm mt-2">
          <div>Session expires: {session.expires_at ? new Date(session.expires_at * 1000).toISOString() : "unknown"}</div>
        </div>
        {CookieDebug()}
      </div>
    </main>
  );
}
