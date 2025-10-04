import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { buildCookieAdapter } from "@/lib/auth/cookies";

export const runtime = "nodejs";

const PROVIDERS = new Set(["google", "facebook"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = (url.searchParams.get("provider") || "").toLowerCase();
  if (!PROVIDERS.has(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const redirectTo = `${url.origin}/auth/callback?next=/account`;

  // Prepare response now so we can attach PKCE cookies
  const response = NextResponse.redirect(url, { status: 302 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: buildCookieAdapter(request.headers.get("cookie"), response),
    }
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "google" | "facebook",
    options: { redirectTo },
  });

  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message || "OAuth init failed" }, { status: 500 });
  }

  response.headers.set("Location", data.url);
  return response;
}
