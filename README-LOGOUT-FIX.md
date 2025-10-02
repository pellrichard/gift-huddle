# Logout + OAuth callback hardening

This patch ensures logout reliably destroys Supabase cookies and the OAuth callback uses
the new server client without legacy parameters.

## Changes
- `app/logout/route.ts`:
  - Calls `supabase.auth.signOut()`.
  - Aggressively clears any `sb-*` cookies via `cookies().set(..., maxAge: 0)`.
  - Redirects with 303 to `/?next=...` target (defaults to `/`).

- `app/auth/callback/route.ts`:
  - Uses `createRouteHandlerClient()`.
  - Exchanges code via `supabase.auth.exchangeCodeForSession(code)`.
  - Validates `next` to prevent open redirects; defaults to `/account`.

## Deploy checklist
- Rebuild & deploy, then test:
  1. Login → view /account.
  2. Logout → redirected to `/`, cookies cleared.
  3. Login again → `/account` loads as expected.

_Updated 2025-10-02T15:32:41.870433Z_
