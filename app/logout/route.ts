import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createServerComponentClient();
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore; still redirect
  }
  // Derive origin from the incoming request to avoid hardcoding localhost in prod
  const location = new URL("/login", request.url);
  return NextResponse.redirect(location, { status: 302 });
}
