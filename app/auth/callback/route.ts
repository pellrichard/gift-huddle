import { NextResponse, type NextRequest } from "next/server";

function getNext(url: URL) {
  const n = url.searchParams.get("next");
  return n && n.startsWith("/") ? n : "/";
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  return NextResponse.redirect(new URL(getNext(url), url.origin));
}
