import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: Request) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookieHeader = (req.headers.get("cookie") ?? "");
          const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
          return match ? decodeURIComponent(match[1]) : null;
        },
        set(name, value, options) {
          const cookie = `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax` +
            (options.maxAge ? `; Max-Age=${options.maxAge}` : "") +
            (options.expires ? `; Expires=${options.expires.toUTCString()}` : "") +
            (options.domain ? `; Domain=${options.domain}` : "") +
            (options.path ? `; Path=${options.path}` : "") +
            (options.secure ? `; Secure` : "");
          res.headers.append("Set-Cookie", cookie);
        },
        remove(name, options) {
          const cookie = `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax` +
            (options.domain ? `; Domain=${options.domain}` : "");
          res.headers.append("Set-Cookie", cookie);
        },
      },
    }
  );

  // Ensure session cookies are fresh
  await supabase.auth.getUser();

  const url = new URL(req.url);
  if (url.pathname.startsWith("/app")) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*"],
};
