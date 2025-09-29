import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: list current user's events (optionally ?from=YYYY-MM-DD&to=YYYY-MM-DD)
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let query = supabase.from("events").select("*").eq("user_id", user.id).order("event_date", { ascending: true });
  if (from) query = query.gte("event_date", from);
  if (to) query = query.lte("event_date", to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: create event { title, event_date, event_type?, notes? }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload = {
    user_id: user.id,
    title: String(body.title || "").slice(0, 140),
    event_date: body.event_date, // expect YYYY-MM-DD
    event_type: ["birthday","anniversary","holiday","other"].includes(body.event_type) ? body.event_type : "other",
    notes: body.notes ? String(body.notes).slice(0, 1000) : null,
  };

  if (!payload.title || !payload.event_date) {
    return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("events").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE: /api/events?id=UUID
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("events").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
