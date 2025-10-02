Hardening Patch – Fix "no cookie after OAuth" + unify login

Changes
- `/app/sign-in/page.tsx` now server-redirects to `/login` (removes duplicate sign-in UI).
- `src/lib/supabase/server.ts` sets sane cookie defaults and allows `AUTH_COOKIE_DOMAIN` to scope cookies to `.gift-huddle.com` when needed.
- `middleware.ts` optionally canonicalizes host when `SITE_HOST` is set (prevents cross-subdomain cookie traps such as apex vs www).

Environment
- `SITE_HOST=www.gift-huddle.com` (or your chosen canonical host)
- `AUTH_COOKIE_DOMAIN=.gift-huddle.com` (recommended if you use both apex and www at any point)
- Existing Supabase env remains unchanged.

QA
1) Visit `https://www.gift-huddle.com/login` while signed out → see providers.
2) Sign in with Facebook/Google → you should land on `/account` and see `sb-access-token`/`sb-refresh-token` cookies set for the canonical host.
3) Hit `/login` while signed in → immediate redirect to `/account`.
4) Try loading the apex domain (if it exists) → auto-redirects to the canonical host.