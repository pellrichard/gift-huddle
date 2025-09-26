// app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type FBUser = {
  id?: string;
  name?: string;
  email?: string;
  birthday?: string; // "MM/DD/YYYY" or "MM/DD"
};

function parseFacebookBirthday(b?: string): {
  birthdate: string | null;
  birth_day: number | null;
  birth_month: number | null;
  hide_birth_year: boolean;
} {
  if (!b) return { birthdate: null, birth_day: null, birth_month: null, hide_birth_year: true };
  const parts = b.split("/");
  if (parts.length < 2) return { birthdate: null, birth_day: null, birth_month: null, hide_birth_year: true };
  const [mm, dd, yyyy] = parts;
  const month = parseInt(mm, 10) || null;
  const day = parseInt(dd, 10) || null;
  const hasYear = !!yyyy;
  const iso = hasYear && month && day
    ? `${yyyy.padStart(4,"0")}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}`
    : null;
  return {
    birthdate: iso,
    birth_day: day,
    birth_month: month,
    hide_birth_year: !hasYear
  };
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/account";

  const supabase = createRouteHandlerClient({ cookies });

  if (code) {
    // 1) Exchange the PKCE code for a session (sets cookies)
    await supabase.auth.exchangeCodeForSession(code);

    // 2) Get session + user
    const [{ data: sessionData }, { data: userData }] = await Promise.all([
      supabase.auth.getSession(),
      supabase.auth.getUser(),
    ]);
    const session = sessionData.session;
    const user = userData.user;

    // 3) If it's a Facebook login, we should have provider_token
    const fbToken = session?.provider_token;

    // 4) Fetch extra fields from Graph API if we have a token
    let fb: FBUser | null = null;
    if (fbToken) {
      const fields = ["id","name","email","birthday"]; // ensure you requested these scopes
      const res = await fetch(`https://graph.facebook.com/v20.0/me?fields=${fields.join(",")}&access_token=${fbToken}`);
      if (res.ok) {
        fb = await res.json();
      }
    }

    // 5) Upsert into public.profiles
    if (user) {
      const parsed = parseFacebookBirthday(fb?.birthday);
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fb?.name ?? user.user_metadata?.full_name ?? null,
        email: fb?.email ?? user.email ?? null,
        avatar_url: fb?.id ? `https://graph.facebook.com/${fb.id}/picture?type=large` : (user.user_metadata as any)?.avatar_url ?? null,
        birthdate: parsed.birthdate,
        birth_day: parsed.birth_day,
        birth_month: parsed.birth_month,
        hide_birth_year: parsed.hide_birth_year,
        fb_id: fb?.id ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
