import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";
  // Redirect to next — browsers don't send hash fragments like #_=_ to the server,
  // so this ensures a clean path after OAuth.
  return NextResponse.redirect(new URL(next, url.origin), { status: 302 });
}
