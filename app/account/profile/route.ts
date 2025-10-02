// app/account/profile/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerComponentClient } from "@/lib/supabase/server";

const ProfileSchema = z.object({
  full_name: z.string().min(1).max(120),
  dob: z.string().nullable().optional(),
  preferred_currency: z.enum(["GBP", "USD", "EUR"]),
  notify_channel: z.enum(["email", "push", "none"]),
  categories: z.array(z.string()).default([]),
  preferred_shops: z.array(z.string()).default([]),
});

type Currency = "GBP" | "USD" | "EUR";
type ProfileUpsert = {
  id: string;
  full_name: string;
  dob: string | null;
  preferred_currency: Currency;
  notify_channel: "email" | "push" | "none";
  categories: string[];
  preferred_shops: string[];
  updated_at: string;
};

export async function POST(req: Request) {
  const supabase = createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const v = parsed.data;

  const payload: ProfileUpsert = {
    id: user.id,
    full_name: v.full_name,
    dob: v.dob ? v.dob : null,
    preferred_currency: v.preferred_currency,
    notify_channel: v.notify_channel,
    categories: v.categories,
    preferred_shops: v.preferred_shops,
    updated_at: new Date().toISOString(),
  };

  // Minimal, lint-safe shim to avoid `never` inserts without using `any`
  const sb = supabase as unknown as {
    from: (name: string) => {
      upsert: (values: unknown, options?: unknown) => Promise<{ error: { message: string } | null }>;
    };
  };

  const { error } = await sb.from("profiles").upsert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
