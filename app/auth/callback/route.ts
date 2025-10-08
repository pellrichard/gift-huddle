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

  // We'll return a 200 HTML page so any Set-Cookie headers are preserved by proxies/CDNs.
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${next}">
<title>Signing you in…</title>
<meta name="robots" content="noindex">
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;padding:24px}</style>
</head><body>
  <p>Signing you in…</p>
  <script>location.replace(${JSON.stringify(next)});</script>
  <noscript><a href="${next}">Continue</a></noscript>
</body></html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });

  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      { cookies: buildCookieAdapter(request.headers.get("cookie"), response) }
    );

    // Complete the OAuth flow and set cookies on *this* 200 response
    await supabase.auth.exchangeCodeForSession(request.url);

    // Best-effort bootstrap of the user's profile
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
    console.error(`[${code}] /auth/callback (200) failed:`, e);
    response.headers.set("x-error-id", code);
  }

  return response;
}
