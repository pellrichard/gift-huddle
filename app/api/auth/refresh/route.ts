import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = createRouteHandlerClient();
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      status: "ok",
      session: data?.session
        ? {
            expires_at: data.session.expires_at,
            token_type: data.session.token_type,
          }
        : null,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
