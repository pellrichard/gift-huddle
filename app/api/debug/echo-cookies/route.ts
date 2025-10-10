import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  return NextResponse.json({ ok: true, cookieHeader }, { status: 200 });
}
