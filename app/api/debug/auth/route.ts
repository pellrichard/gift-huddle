import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const names = ['sb-access-token','sb-refresh-token','supabase-auth-token','gh_authed'];
  const present = Object.fromEntries(names.map(n => [n, Boolean(req.cookies.get(n))]));
  const list = Array.from(req.cookies.getAll ? req.cookies.getAll() : []).map(c => c.name);
  const body = {
    host: req.nextUrl.host,
    path: req.nextUrl.pathname,
    present,
    allCookieNames: list,
  };
  return NextResponse.json(body, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}