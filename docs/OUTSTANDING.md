# Outstanding

- Success toast on `/account` when redirected with `?saved=1` (auto-hide, replaceState).
- Remove `msg` from query string in production; keep `err` + `rid` only.
- Replace casts with a tiny typed helper around Supabase `.from("profiles")` update/upsert.
- Add read-only chips for current preferences on `/account`.
- Add security headers (CSP, HSTS, Referrer-Policy) via `next.config`.
- Add Playwright test for onboarding happy-path.
- Add Sentry for client & route errors.
