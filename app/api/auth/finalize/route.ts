import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { buildCookieAdapter } from "@/lib/auth/cookies";
import { newErrorId } from "@/lib/error-id";
import type { Database } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const full = url.searchParams.get("full");
  if (!full) {
    return NextResponse.json({ ok: false, error: "Missing full callback URL" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      { cookies: buildCookieAdapter(request.headers.get("cookie"), res) }
    );

    await supabase.auth.exchangeCodeForSession(full);
    return res;
  } catch (e) {
    const code = newErrorId("E7");
    console.error(`[${code}] /api/auth/finalize failed:`, e);
    res.headers.set("x-error-id", code);
    return NextResponse.json({ ok: false, error: "Finalize failed", code }, { status: 500, headers: res.headers });
  }
}
