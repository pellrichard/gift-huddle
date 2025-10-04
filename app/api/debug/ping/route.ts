import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === 'production') { return new Response('Not available in production', { status: 404 }); }

  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    env: {
      node: process.version,
    },
  });
}
