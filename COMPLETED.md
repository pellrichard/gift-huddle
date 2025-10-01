# Completed items (2025-10-01)

- OAuth callback now persists Supabase cookies to the redirect response (fixes login loop).
- Server-rendered Header(s) show **Account** + **Log out** when authed, **Login** otherwise.
- `/logout` is server-bound and redirects to home, clearing cookies.
- Middleware protects `/account` and redirects authed users away from `/login`/`/signup`.
- Pages added: `/terms`, `/contact`, `/privacy`.
- Footer: `/logo.svg` + only Facebook & LinkedIn, open in new tabs.
- Homepage: redirects to `/account` when auth cookies present.
- Login UI: compact OAuth buttons with colored logos.
- Account page scaffold: server-rendered overview + Preferences form (currency, notifications, interests, budget, sizes) saving into `profiles.categories` as `{ interests, budget_monthly, sizes }`.
- Debug: `/_debug/auth` and `/api/_debug/auth` for quick diagnostics.
