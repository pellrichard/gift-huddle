import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/account";

  const html = `<!doctype html>
<html><head><meta charset="utf-8">
<title>Finishing sign-in…</title>
<meta name="robots" content="noindex">
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;padding:24px}</style>
</head><body>
  <p>Finishing sign-in…</p>
  <script>
    (async function() {
      try {
        const full = window.location.href;
        await fetch('/api/auth/finalize?full=' + encodeURIComponent(full), { credentials: 'include' });
      } catch (e) { }
      location.replace("/account" || "/account");
    })();
  </script>
  <noscript><a href="${next}">Continue</a></noscript>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-auth-callback": "1"
    },
  });
}
