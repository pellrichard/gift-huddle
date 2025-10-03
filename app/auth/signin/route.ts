import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const PROVIDERS = new Set(["google", "facebook"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = (url.searchParams.get("provider") || "").toLowerCase();

  if (!PROVIDERS.has(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const origin = url.origin;
  const redirectTo = `${origin}/auth/callback?next=/account`;

  const supabase = createServerComponentClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "google" | "facebook",
    options: { redirectTo },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Supabase returns a URL to redirect the browser to the provider
  return NextResponse.redirect(data.url, { status: 302 });
}
