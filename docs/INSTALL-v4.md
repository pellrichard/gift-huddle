# Auth Callback Fix v4 — Logging & Debug Params
This version logs PKCE exchange details to the server logs and appends
`link_debug=1` to your redirect target with helpful query params:
  - `pkce` = ok | error | exception | skipped_no_code
  - `cookies` = number of cookies written by the exchange
  - `host` = request host
  - `link_error` = encoded error message when present

## Apply
- Replace `app/auth/callback/route.ts` with this file.
- Deploy, login, and then check:
  - Browser URL after redirect (look at `link_debug` params).
  - Vercel logs for `[auth/callback]` entries.

If `pkce=ok` **and** `cookies>0` but you still don’t see cookies in DevTools,
the issue is likely cookie `domain`/`host` mismatch. Ensure Supabase **Site URL**
is exactly `https://www.gift-huddle.com`.
