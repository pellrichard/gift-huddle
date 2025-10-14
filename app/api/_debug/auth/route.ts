export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse, type NextRequest } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') { return new Response('Not available in production', { status: 404 }); }

  const supabase = await createServerComponentClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  const cookieEntries = Array.from(req.cookies.getAll()).map(c => ({
    name: c.name,
    value: c.value ? (c.value.length > 6 ? c.value.slice(0,6) + "â€¦(" + c.value.length + ")" : c.value) : "",
  }));

  return NextResponse.json({
    url: req.url,
    session_present: !!session,
    user_id: session?.user?.id ?? null,
    access_token_len: session?.access_token?.length ?? 0,
    error: error?.message ?? null,
    cookies: cookieEntries,
  });
}

