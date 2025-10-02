import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

type CookieWrite = (init: { name: string; value: string; path?: string; maxAge?: number }) => void;
type CookieStore = { getAll?: () => Array<{ name: string }>; set?: CookieWrite };

function isCookieStore(x: unknown): x is CookieStore {
  if (typeof x !== "object" || x === null) return false;
  const obj = x as Record<string, unknown>;
  const setter = obj["set"];
  return typeof setter === "function";
}

function getProjectRefFromUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const m = url.match(/^https?:\/\/(.+?)\./i);
    if (m && m[1]) return m[1];
  } catch {}
  return null;
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient();

  // Sign out via Supabase (writes cookie changes in this context)
  await supabase.auth.signOut();

  // Defensive: attempt to clear any lingering sb-* cookies
  const raw = cookies() as unknown;
  const store = isCookieStore(raw) ? (raw as CookieStore) : null;

  if (store?.set) {
    const all = store.getAll?.();
    if (Array.isArray(all)) {
      for (const { name } of all) {
        if (name && name.startsWith("sb-")) {
          store.set({ name, value: "", maxAge: 0, path: "/" });
        }
      }
    } else {
      // Fallback: clear the two known cookie names using the project ref from URL
      const ref = getProjectRefFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
      if (ref) {
        const names = [
          `sb-${ref}-auth-token`,
          `sb-${ref}-refresh-token`,
        ];
        for (const name of names) {
          store.set({ name, value: "", maxAge: 0, path: "/" });
        }
      }
    }
  }

  const nextUrl = new URL(req.url);
  const next = nextUrl.searchParams.get("next") || "/";
  return NextResponse.redirect(new URL(next, req.url), { status: 303 });
}
