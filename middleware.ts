import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: Request) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return req.headers.get("cookie")?.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null; },
        set(name, value, options) {
          res.headers.append("Set-Cookie", `${name}=${value}; Path=/; HttpOnly; SameSite=Lax${options.maxAge ? `; Max-Age=${options.maxAge}` : ""}${options.expires ? `; Expires=${options.expires.toUTCString()}` : ""}${options.domain ? `; Domain=${options.domain}` : ""}${options.path ? `; Path=${options.path}` : ""}${options.secure ? `; Secure` : ""}`);
        },
        remove(name, options) {
          res.headers.append("Set-Cookie", `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${options.domain ? `; Domain=${options.domain}` : ""}`);
        },
      },
    }
  );

  // This will refresh the session cookies if needed
  await supabase.auth.getUser();

  // Example: gate /app routes
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
  matcher: ["/app/:path*"], // protect anything under /app
};
