// app/account/events/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerComponentClient } from "@/lib/supabase/server";

const EventSchema = z.object({
  title: z.string().min(1).max(120),
  type_id: z.number().int().nullable().optional(),
  event_date: z.string().min(1), // "YYYY-MM-DD"
  notes: z.string().max(2000).optional(),
  budget_cents: z.number().int().nullable().optional(),
  currency: z.enum(["GBP", "USD", "EUR"]).default("GBP"),
  recurrence: z.string().max(300).nullable().optional(), // RRULE
  friend_id: z.string().uuid().nullable().optional(),
  draw_date: z.string().nullable().optional(),
});

type Currency = "GBP" | "USD" | "EUR";
type EventInsert = {
  user_id: string;
  title: string;
  type_id: number | null;
  event_date: string;
  notes: string | null;
  budget_cents: number | null;
  currency: Currency;
  recurrence: string | null;
  friend_id: string | null;
  draw_date: string | null;
};

export async function POST(req: Request) {
  const supabase = createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = EventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const v = parsed.data;

  const insertPayload: EventInsert[] = [
    {
      user_id: user.id,
      title: v.title,
      type_id: v.type_id ?? null,
      event_date: v.event_date,
      notes: v.notes ?? null,
      budget_cents: v.budget_cents ?? null,
      currency: v.currency ?? "GBP",
      recurrence: v.recurrence ?? null,
      friend_id: v.friend_id ?? null,
      draw_date: v.draw_date ?? null,
    },
  ];

  type MinimalPostgrest = {
    from: (name: string) => {
      insert: (values: unknown, options?: unknown) => {
        select: () => {
          single: () => Promise<{ data: unknown; error: { message: string } | null }>;
        };
      };
    };
  };

  const sb = supabase as unknown as MinimalPostgrest;

  const { data, error } = await sb
    .from("events")
    .insert(insertPayload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, event: data });
}
