import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";
  // By the time this runs, Supabase has set cookies via the hosted callback.
  // We just forward the user to their intended destination.
  return NextResponse.redirect(new URL(next, url.origin), { status: 302 });
}
