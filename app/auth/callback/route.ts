import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { buildCookieAdapter } from "@/lib/auth/cookies";
import type { Database, Json } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";

  // Prepare the redirect we'll attach cookies to
  const res = NextResponse.redirect(new URL(next, url.origin), { status: 302 });

  // Supabase SSR client wired to read existing cookies and append Set-Cookie to 'res'
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: buildCookieAdapter(request.headers.get("cookie"), res) }
  );

  // Complete OAuth and write session cookies onto the redirect response
  await supabase.auth.exchangeCodeForSession(request.url);

  // Create/refresh the profile row immediately (idempotent)
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const full_name =
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email?.split("@")[0] ?? "";

    const avatar_url =
      (user.user_metadata?.avatar_url as string | undefined) ??
      (user.user_metadata?.picture as string | undefined) ??
      null;

    const payload: Database["public"]["Tables"]["profiles"]["Insert"] = {
      id: user.id,
      full_name,
      email: user.email ?? null,
      avatar_url,
      socials: {} as Json,
    };

    await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  }

  return res;
}
