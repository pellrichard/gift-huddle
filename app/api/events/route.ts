import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type EventsInsert = Database["public"]["Tables"]["events"]["Insert"];

// POST: create new event
export async function POST(req: NextRequest) {
  const base = await createClient();
  // Force the correct generic so table types aren't `never`
  const supabase = base as unknown as SupabaseClient<Database, "public">;

  const payload = (await req.json()) as EventsInsert;

  try {
    const { data, error } = await supabase
      .from("events")
      .insert(payload)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// GET: list events for current user (optional date window)
export async function GET(req: NextRequest) {
  const base = await createClient();
  const supabase = base as unknown as SupabaseClient<Database, "public">;

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = supabase.from("events").select("*").order("event_date", { ascending: true });
  if (from) query = query.gte("event_date", from);
  if (to) query = query.lte("event_date", to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
