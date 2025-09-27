// app/(auth)/callback/facebook/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type FbPermission = { permission: string; status: "granted" | "declined" };
type FbPermissionsResponse = { data?: FbPermission[] };
type FbPicture = { data?: { url?: string } };
type FbResponse = {
  id?: string;
  name?: string;
  email?: string;
  birthday?: string; // "MM/DD/YYYY" or "MM/DD"
  picture?: FbPicture;
};

function parseFacebookBirthday(birthday?: string): { dobDate: string | null; yearPresent: boolean } {
  if (!birthday) return { dobDate: null, yearPresent: false };
  const parts = birthday.split("/");
  if (parts.length < 2) return { dobDate: null, yearPresent: false };
  const [mm, dd, yyyy] = parts;
  const month = String(mm).padStart(2, "0");
  const day = String(dd).padStart(2, "0");
  if (yyyy) {
    const iso = `${yyyy}-${month}-${day}`;
    return { dobDate: iso, yearPresent: true };
  } else {
    const iso = `1904-${month}-${day}`; // placeholder year; we hide it anyway
    return { dobDate: iso, yearPresent: false };
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const supabase = createRouteHandlerClient({ cookies });

  // Exchange OAuth code for session (avoid URLSearchParams type mismatch)
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", req.url));
  }
  const exchange = await supabase.auth.exchangeCodeForSession(code);
  if (exchange.error) {
    console.error("exchangeCodeForSession error:", exchange.error);
    return NextResponse.redirect(new URL("/login?error=oauth", req.url));
  }

  const userRes = await supabase.auth.getUser();
  const user = userRes.data?.user;
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=nologin", req.url));
  }

  const sessionRes = await supabase.auth.getSession();
  const providerToken = sessionRes.data?.session?.provider_token;

  let fb: FbResponse | null = null;
  let granted: string[] = [];

  if (providerToken) {
    const fields = ["id", "name", "email", "birthday", "picture.type(large){url}"].join(",");
    const graphUrl = `https://graph.facebook.com/v20.0/me?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(providerToken)}`;

    try {
      const res = await fetch(graphUrl, { cache: "no-store" });
      if (res.ok) {
        fb = (await res.json()) as FbResponse;
      } else {
        console.warn("Facebook Graph error:", await res.text());
      }

      const permsRes = await fetch(
        `https://graph.facebook.com/v20.0/me/permissions?access_token=${encodeURIComponent(providerToken)}`
      );
      if (permsRes.ok) {
        const permsJson = (await permsRes.json()) as FbPermissionsResponse;
        granted = (permsJson.data ?? [])
          .filter((p) => p.status === "granted")
          .map((p) => p.permission);
      }
    } catch (e) {
      console.error("Graph fetch failed:", e);
    }
  }

  const full_name =
    fb?.name ?? (user.user_metadata as Record<string, unknown> | undefined)?.["full_name"] ?? null;
  const email = fb?.email ?? user.email ?? null;
  const fb_id =
    fb?.id ?? (user.user_metadata as Record<string, unknown> | undefined)?.["provider_id"] ?? null;
  const fb_picture_url = fb?.picture?.data?.url ?? null;

  const { dobDate, yearPresent } = parseFacebookBirthday(fb?.birthday);
  const hideBirthYear = !yearPresent;

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name,
    email,
    dob: dobDate,
    hide_birth_year: hideBirthYear,
    fb_id,
    fb_picture_url,
    fb_last_sync: new Date().toISOString(),
    permissions_granted: granted,
  });

  return NextResponse.redirect(new URL("/account", req.url));
}
