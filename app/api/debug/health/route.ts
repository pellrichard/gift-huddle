import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createRouteHandlerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return NextResponse.json({
    ok: true,
    user: user ? { id: user.id, email: user.email } : null,
    authError: error?.message ?? null,
    time: new Date().toISOString(),
  });
}
