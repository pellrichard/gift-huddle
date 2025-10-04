import { NextResponse } from "next/server";

export type Cookie = { name: string; value: string };

// Align with Next.js ResponseCookie expectations (expires: number | Date)
export type CookieOptions = {
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: number | Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
};

export function parseCookieHeader(header: string | null | undefined): Cookie[] {
  if (!header) return [];
  return header.split(/;\s*/).map((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return { name: part, value: "" };
    return { name: part.slice(0, idx), value: part.slice(idx + 1) };
  });
}

function normalizeOptions(options?: CookieOptions): CookieOptions {
  const o: CookieOptions = { path: "/", ...(options ?? {}) };
  // no string here; already typed as number | Date
  return o;
}

export function buildCookieAdapter(requestCookieHeader: string | null | undefined, response: NextResponse) {
  const parsed = parseCookieHeader(requestCookieHeader);

  const write = (name: string, value: string, options?: CookieOptions) => {
    const finalOptions = normalizeOptions(options);
    response.cookies.set(name, value, finalOptions);
  };

  const remove = (name: string, options?: CookieOptions) => {
    write(name, "", { ...(options ?? {}), maxAge: 0, path: "/" });
  };

  return {
    // Newer API
    getAll(): Cookie[] {
      return parsed;
    },
    setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]): void {
      for (const { name, value, options } of cookiesToSet) write(name, value, options);
    },
    // Legacy API
    get(name: string): string | undefined {
      return parsed.find((c) => c.name === name)?.value ?? undefined;
    },
    set(name: string, value: string, options?: CookieOptions): void {
      write(name, value, options);
    },
    remove(name: string, options?: CookieOptions): void {
      remove(name, options);
    },
  };
}
