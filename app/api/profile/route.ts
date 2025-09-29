import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ProfileUpdate = {
  display_name: string;
  dob: string | null;             // ISO yyyy-mm-dd or null
  dob_show_year: boolean;
  categories: string[];
  preferred_shops: string[];
  socials: Record<string, string>;
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-bootstrap an empty profile row
  if (!data) {
    const { data: inserted, error: insErr } = await supabase.from("profiles").insert({
      id: user.id,
      display_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
      socials: {},
      categories: [],
      preferred_shops: []
    }).select("*").single();
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
    return NextResponse.json(inserted);
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Partial<ProfileUpdate>;

  const payload: ProfileUpdate = {
    display_name: (body.display_name ?? "").toString().slice(0, 120),
    dob: body.dob ?? null,
    dob_show_year: Boolean(body.dob_show_year),
    categories: Array.isArray(body.categories) ? body.categories.slice(0, 50).map(String) : [],
    preferred_shops: Array.isArray(body.preferred_shops) ? body.preferred_shops.slice(0, 50).map(String) : [],
    socials: body.socials && typeof body.socials === "object" ? Object.fromEntries(Object.entries(body.socials).map(([k,v]) => [String(k), String(v ?? "")])) : {},
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...payload }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
