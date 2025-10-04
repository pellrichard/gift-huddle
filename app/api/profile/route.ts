import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/** Ensure a profile exists for the signed-in user (with explicit client cast). */
export async function GET() {
  // Force the correct generic so table types aren't `never` in strict builds
  const base = createRouteHandlerClient();
  const supabase = base as unknown as SupabaseClient<Database, "public">;

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "";

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, display_name: displayName, socials: {} },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** Update profile fields (partial) â€” explicit client cast for safety. */
export async function POST(req: Request) {
  const base = createRouteHandlerClient();
  const supabase = base as unknown as SupabaseClient<Database, "public">;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload: Record<string, unknown> = {};

  if (typeof body.display_name === "string") {
    payload.display_name = body.display_name;
  }

  if (typeof body.dob === "string") {
    payload.dob = body.dob;
  }

  if (typeof body.dob_show_year === "boolean") {
    payload.dob_show_year = body.dob_show_year;
  }

  if (Array.isArray(body.categories)) {
    payload.categories = body.categories.slice(0, 50).map(String);
  }

  if (Array.isArray(body.preferred_shops)) {
    payload.preferred_shops = body.preferred_shops.slice(0, 50).map(String);
  }

  if (body.socials && typeof body.socials === "object") {
    payload.socials = body.socials;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

