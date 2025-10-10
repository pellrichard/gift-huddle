import { NextRequest, NextResponse } from "next/server";
import { logWithId } from "@/lib/error-id";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type EventsInsert = Database["public"]["Tables"]["events"]["Insert"];

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient();
    const payload = (await req.json()) as EventsInsert;

    const { data, error } = await supabase
      .from("events")
      .insert(payload)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const code = logWithId("/api/events POST", e);
    return NextResponse.json({ error: "Something went wrong", code }, { status: 500, headers: { "x-error-id": code } });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient();
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = supabase.from("events").select("*").order("event_date", { ascending: true });
    if (from) query = query.gte("event_date", from);
    if (to) query = query.lte("event_date", to);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    const code = logWithId("/api/events GET", e);
    return NextResponse.json({ error: "Something went wrong", code }, { status: 500, headers: { "x-error-id": code } });
  }
}
