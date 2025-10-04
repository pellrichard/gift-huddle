import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') { return new Response('Not available in production', { status: 404 }); }

  const url = new URL(request.url);
  return NextResponse.json({
    ok: true,
    origin: url.origin,
    href: url.href,
    host: url.host,
    protocol: url.protocol,
  });
}
