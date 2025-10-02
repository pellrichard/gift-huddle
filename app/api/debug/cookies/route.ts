import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

type CookieEntry = { name: string };
type CookieStore = { getAll?: () => CookieEntry[] };

function isCookieStore(x: unknown): x is CookieStore {
  if (typeof x !== "object" || x === null) return false;
  const obj = x as Record<string, unknown>;
  // Either supports getAll() or not; we only need to safely check existence
  return "getAll" in obj;
}

export async function GET() {
  const raw = cookies() as unknown;
  const store = isCookieStore(raw) ? raw : null;
  const list = store?.getAll ? store.getAll() : [];
  const names = Array.isArray(list) ? list.map((x) => x.name).filter(Boolean) : [];
  return NextResponse.json({ cookies: names });
}
