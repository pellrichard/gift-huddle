import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const supabase = await createClient();

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(new URL("/?auth=error", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/?auth=error", request.url));
    }
  }
  return NextResponse.redirect(new URL("/account", request.url));
}
