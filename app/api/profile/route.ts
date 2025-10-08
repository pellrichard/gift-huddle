import { NextRequest, NextResponse } from "next/server";
import { logWithId } from "@/lib/error-id";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

/** Ensure a profile exists for the signed-in user. */
export async function GET() {
  try {
    const supabase = createRouteHandlerClient();

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const displayName =
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "";

    const insert = {
      id: user.id,
      full_name: displayName,
      email: user.email ?? null,
      avatar_url:
        (user.user_metadata?.avatar_url as string | undefined) ??
        (user.user_metadata?.picture as string | undefined) ??
        null,
      socials: ({} as Json),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(insert, { onConflict: "id" })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    const code = logWithId("/api/profile GET", e);
    return NextResponse.json({ error: "Something went wrong", code }, { status: 500, headers: { "x-error-id": code } });
  }
}

/** Update profile fields (partial). */
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const payload: Partial<import("@/lib/supabase/types").Database["public"]["Tables"]["profiles"]["Update"]> = {
      full_name: typeof body.full_name === "string" ? body.full_name : undefined,
      dob: typeof body.dob === "string" ? body.dob : undefined,
      show_dob_year: typeof body.show_dob_year === "boolean" ? body.show_dob_year : undefined,
      preferred_currency: typeof body.preferred_currency === "string" ? body.preferred_currency : undefined,
      notify_channel: typeof body.notify_channel === "string" ? body.notify_channel : undefined,
      avatar_url: typeof body.avatar_url === "string" ? body.avatar_url : undefined,
      interests: Array.isArray(body.interests) ? body.interests.map(String) : undefined,
      preferred_shops: Array.isArray(body.preferred_shops) ? body.preferred_shops.map(String) : undefined,
      categories: Array.isArray(body.categories) ? body.categories.map(String) : undefined,
      notify_mobile: typeof body.notify_mobile === "boolean" ? body.notify_mobile : undefined,
      notify_email: typeof body.notify_email === "boolean" ? body.notify_email : undefined,
      unsubscribe_all: typeof body.unsubscribe_all === "boolean" ? body.unsubscribe_all : undefined,
      socials: body.socials && typeof body.socials === "object" ? (body.socials as Json) : undefined,
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    const code = logWithId("/api/profile POST", e);
    return NextResponse.json({ error: "Something went wrong", code }, { status: 500, headers: { "x-error-id": code } });
  }
}
