import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

// Build a cookies adapter that works for @supabase/ssr createServerClient in route handlers.
export function buildCookieAdapter(requestCookieHeader: string | null, response: Response) {
  // Parse request cookies into a map
  const reqCookieMap = new Map<string, string>();
  if (requestCookieHeader) {
    for (const part of requestCookieHeader.split(/;\s*/)) {
      const [k, v] = part.split("=");
      if (k) reqCookieMap.set(k, v ?? "");
    }
  }

  function setAll(cookies: { name: string; value: string; options?: Partial<ResponseCookie> }[]) {
    // Append Set-Cookie to the Response headers (supports multiple cookies)
    const headers: Headers = (response as Response).headers;
    for (const c of cookies) {
      const chunks: string[] = [];
      chunks.push(`${c.name}=${c.value}`);
      const opt = c.options ?? {};
      if (opt.maxAge !== undefined) chunks.push(`Max-Age=${opt.maxAge}`);
      if (opt.expires) chunks.push(`Expires=${new Date(opt.expires).toUTCString()}`);
      if (opt.path) chunks.push(`Path=${opt.path}`);
      if (opt.domain) chunks.push(`Domain=${opt.domain}`);
      if (opt.httpOnly) chunks.push("HttpOnly");
      if (opt.secure) chunks.push("Secure");
      if (opt.sameSite) chunks.push(`SameSite=${typeof opt.sameSite === "string" ? opt.sameSite : (opt.sameSite === true ? "Strict" : "Lax")}`);
      headers.append("Set-Cookie", chunks.join("; "));
    }
  }

  function getAll() {
    return Array.from(reqCookieMap.entries()).map(([name, value]) => ({ name, value }));
  }

  return {
    getAll,
    setAll,
  };
}
