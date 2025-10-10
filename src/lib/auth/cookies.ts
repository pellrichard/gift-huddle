import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function buildCookieAdapter(requestCookieHeader: string | null, response: Response) {
  const reqCookieMap = new Map<string, string>();
  if (requestCookieHeader) {
    for (const part of requestCookieHeader.split(/;\s*/)) {
      const [k, v] = part.split("=");
      if (k) reqCookieMap.set(k, v ?? "");
    }
  }

  function getAll() {
    return Array.from(reqCookieMap.entries()).map(([name, value]) => ({ name, value }));
  }

  function setAll(cookies: { name: string; value: string; options?: Partial<ResponseCookie> }[]) {
    const headers: Headers = (response as Response).headers;
    for (const c of cookies) {
      const out: string[] = [];
      out.push(`${c.name}=${c.value}`);
      const opt = c.options ?? {};
      if (opt.maxAge !== undefined) out.push(`Max-Age=${opt.maxAge}`);
      if (opt.expires) out.push(`Expires=${new Date(opt.expires).toUTCString()}`);
      if (opt.path) out.push(`Path=${opt.path}`);
      if (opt.domain) out.push(`Domain=${opt.domain}`);
      if (opt.httpOnly) out.push("HttpOnly");
      if (opt.secure) out.push("Secure");
      if (opt.sameSite) out.push(
        `SameSite=${typeof opt.sameSite === "string" ? opt.sameSite : (opt.sameSite === true ? "Strict" : "Lax")}`
      );
      headers.append("Set-Cookie", out.join("; "));
    }
  }

  return { getAll, setAll };
}
