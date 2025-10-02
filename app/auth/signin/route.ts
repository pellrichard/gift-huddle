// /auth/signin?provider=<name>&next=/account
import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import { getEnabledProviders, type Provider } from "@/lib/auth/providers";

export const runtime = "nodejs";

function getNext(url: URL) {
  const n = url.searchParams.get("next");
  if (!n) return "/account";
  try {
    const u = new URL(n, url.origin);
    if (u.origin !== url.origin) return "/account";
    return u.pathname + u.search + u.hash || "/account";
  } catch {
    return "/account";
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const next = getNext(url);
  const siteHost = process.env.SITE_HOST;
  const origin = siteHost ? `https://${siteHost}` : url.origin;

  const allowed: Provider[] = getEnabledProviders();
  const providerParam = url.searchParams.get("provider");
  const provider = allowed.find((p) => p === providerParam) as Provider | undefined;

  if (!provider) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}&error=provider_disabled`, req.url), { status: 303 });
  }

  const supabase = createRouteHandlerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error || !data?.url) {
    return NextResponse.redirect(new URL(`/login?error=oauth_start`, req.url), { status: 303 });
  }

  return NextResponse.redirect(data.url, { status: 303 });
}
