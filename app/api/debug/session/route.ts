import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === 'production') { return new Response('Not available in production', { status: 404 }); }

  const supabase = createRouteHandlerClient();
  const [{ data: userData, error: userErr }, { data: sessData, error: sessErr }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession()
  ]);

  return NextResponse.json({
    user: userData?.user ? { id: userData.user.id, email: userData.user.email } : null,
    session: sessData?.session ? {
      expires_at: sessData.session.expires_at,
      token_type: sessData.session.token_type
    } : null,
    errors: {
      user: userErr?.message ?? null,
      session: sessErr?.message ?? null
    },
    time: new Date().toISOString()
  });
}
