import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { buildCookieAdapter } from "@/lib/auth/cookies";
import { newErrorId } from "@/lib/error-id";
import type { Database, Json } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";

  // Prepare redirect where we'll attach Supabase session cookies
  const response = NextResponse.redirect(new URL(next, url.origin), { status: 302 });
  // Debug marker cookie to verify the response can set cookies at all
  response.cookies.set("gh-debug", "1", { path: "/", maxAge: 120 });

  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      { cookies: buildCookieAdapter(request.headers.get("cookie"), response) }
    );

    await supabase.auth.exchangeCodeForSession(request.url);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const full_name =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        user.email?.split("@")[0] ??
        "";

      const avatar_url =
        (user.user_metadata?.avatar_url as string | undefined) ??
        (user.user_metadata?.picture as string | undefined) ??
        null;

      const insert: Database["public"]["Tables"]["profiles"]["Insert"] = {
        id: user.id,
        full_name,
        email: user.email ?? null,
        avatar_url,
        socials: ({} as Json),
      };
      await supabase.from("profiles").upsert(insert, { onConflict: "id" });
    }
  } catch (e) {
    const code = newErrorId("E7");
    // eslint-disable-next-line no-console
    console.error(`[${code}] /auth/callback failed:`, e);
    response.headers.set("x-error-id", code);
  }

  return response;
}
