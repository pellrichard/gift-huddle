// app/onboarding/update/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type ProfilesUpdate = { categories?: string[] | null; preferred_shops?: string[] | null };

const CATEGORIES = ["tech", "fashion", "beauty", "home", "toys", "sports"];
const SHOPS = ["amazon", "argos", "johnlewis", "etsy", "nike", "apple"];

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const form = await req.formData();
  const categories = form.getAll("categories").map(String);
  const preferred_shops = form.getAll("preferred_shops").map(String);

  const cats = categories.filter((c) => CATEGORIES.includes(c));
  const shops = preferred_shops.filter((s) => SHOPS.includes(s));

  if (cats.length === 0 || shops.length === 0) {
    return NextResponse.redirect(new URL("/onboarding?err=missing", req.url));
  }

  const updateData: ProfilesUpdate = { categories: cats, preferred_shops: shops };

  const { error } = await supabase
    .from("profiles")
    .update(updateData as unknown as never) // satisfy strict TS; data validated above
    .eq("id", session.user.id);

  if (error) {
    return NextResponse.redirect(new URL(`/onboarding?err=${encodeURIComponent(error.code || "update_failed")}`, req.url));
  }

  return NextResponse.redirect(new URL("/account", req.url));
}
