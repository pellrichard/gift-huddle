import { ensureProfileForRequest } from '@/actions/profile'
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { buildCookieAdapter } from "@/lib/auth/cookies";
import type { Database } from "@/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  
  try { await ensureProfileForRequest(); } catch { /* ignore ensure errors */ }
const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";

  // Prepare the redirect we'll attach cookies to
  const res = NextResponse.redirect(new URL(next, url.origin), { status: 302 });

function pickCurrency(country: string | null, acceptLanguage: string | null): Database["public"]["Enums"]["currency_code"] {
  const cc = (country || "").toUpperCase();
  const raw = (acceptLanguage || "").toLowerCase();

  // Quick EU set
  const EU_CC = new Set(["FR","DE","ES","IT","NL","IE","BE","PT","AT","FI","GR","LU","MT","SI","SK","EE","LV","LT","CY","HR","BG","RO","CZ","HU","DK","SE","PL"]);
  if (cc === "GB" || raw.includes("en-gb")) return "GBP";
  if (EU_CC.has(cc)) return "EUR";

  // Parse accept-language like: "en-GB,en;q=0.9,de;q=0.8"
  const langs = raw.split(",").map(s => s.split(";")[0].trim());
  const eurLangTags = new Set(["de","fr","es","it","nl","pt","fi","el","sv","pl","cs","hu","da","sk","sl","hr","ro","bg","et","lv","lt"]);
  for (const tag of langs) {
    const base = tag.split("-")[0];
    if (tag === "en-gb" || base === "en" && tag.endsWith("-gb")) return "GBP";
    if (eurLangTags.has(base)) return "EUR";
  }
  return "USD";
}
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

    const country = request.headers.get("x-vercel-ip-country");
const acceptLanguage = request.headers.get("accept-language");
const derivedCurrency = pickCurrency(country, acceptLanguage);

const { data: existing } = await supabase
  .from("profiles")
  .select("preferred_currency")
  .eq("id", user.id)
  .maybeSingle();

    const payload: Database["public"]["Tables"]["profiles"]["Insert"] = {
      id: user.id,
      full_name,
      email: user.email ?? null,
      ...(!existing || !existing.preferred_currency ? { preferred_currency: derivedCurrency } : {}),
      avatar_url,
          };

    await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  }

  return res;
}
