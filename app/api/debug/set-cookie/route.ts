import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const res = NextResponse.json({ ok: true, note: "Setting gh-test cookie" }, { status: 200 });
  res.cookies.set("gh-test", "1", { path: "/", maxAge: 120, httpOnly: false });
  return res;
}
