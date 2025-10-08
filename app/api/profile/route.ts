import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";

/** Ensure a profile exists for the signed-in user (with explicit client cast). */
export async function GET() {
  const supabase = createRouteHandlerClient();

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "";

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, full_name: displayName, socials: {} },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** Update profile fields (partial) â€” explicit client cast for safety. */
export async function POST(req: Request) {
  const supabase = createRouteHandlerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload = {
    full_name: typeof body.full_name === "string" ? body.full_name : null,
    dob: typeof body.dob === "string" ? body.dob : null,
    show_dob_year: typeof body.show_dob_year === "boolean" ? body.show_dob_year : null,
    categories: Array.isArray(body.categories) ? body.categories.slice(0, 50).map(String) : null,
    preferred_shops: Array.isArray(body.preferred_shops) ? body.preferred_shops.slice(0, 50).map(String) : null,
    socials: body.socials && typeof body.socials === "object" ? body.socials : null,
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

