import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Minimal read-only cookie adapter (deprecated shape) built from the raw Cookie header.
function cookieMethodsDeprecatedFromHeader(cookieHeader: string | null) {
  const map = new Map<string, string>();
  if (cookieHeader) {
    for (const part of cookieHeader.split(/;\s*/)) {
      const [k, v] = part.split('=');
      if (k) map.set(k, v ?? '');
    }
  }
  return {
    get(name: string) {
      return map.get(name);
    },
    set() {},
    remove() {},
  } as const;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie');

  // Presence check for common Supabase cookies
  const names = ['sb-access-token','sb-refresh-token','sb-csrf','sb-pkce-code-verifier'];
  const presentMap = new Map<string, boolean>();
  const have = new Set<string>();
  if (cookieHeader) {
    for (const part of cookieHeader.split(/;\s*/)) {
      const [k] = part.split('=');
      if (k) have.add(k);
    }
  }
  for (const n of names) presentMap.set(n, have.has(n));
  const present = Object.fromEntries(presentMap.entries());

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethodsDeprecatedFromHeader(cookieHeader) }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  return NextResponse.json({ present, user, error: error?.message ?? null });
}
