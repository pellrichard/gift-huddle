import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // The cookies were already set by Supabase via the middleware getUser() step.
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/app";
  return NextResponse.redirect(new URL(next, url.origin));
}
