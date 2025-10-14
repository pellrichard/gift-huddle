import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import type { Database } from "@/supabase/types";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/account";
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=oauth-missing-code", url.origin));
  }

  const supabase = createRouteHandlerClient();
  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth", url.origin));
  }

  const user = session?.user;
  if (user?.id) {
    type ProfilesInsert = Database["public"]["Tables"]["profiles"]["Insert"];
    const payload: ProfilesInsert = {
      id: user.id,
      full_name:
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        null,
      avatar_url:
        (user.user_metadata?.avatar_url as string | undefined) ??
        (user.user_metadata?.picture as string | undefined) ??
        null,
      email: user.email ?? null,
    };

    await supabase
      .from("profiles")
      .upsert<ProfilesInsert>(payload, { onConflict: "id" });
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
