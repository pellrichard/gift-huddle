OAuth End-to-End Fix
====================
This patch does three things:
1) **Forces the final code exchange on your callback** (`/auth/callback`), which sets `sb-*` cookies server-side.
2) **Builds the provider URL on the server** and 303-redirects (no client-side race conditions).
3) **Canonicalizes host including `/auth/:path*`** so the callback always returns to the same host, preserving `?code=`.

Verify
------
- Env:
  - `SITE_HOST=www.gift-huddle.com`
  - `NEXT_PUBLIC_SUPABASE_URL=...`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- Supabase → **Auth → URL Configuration**
  - Site URL: `https://www.gift-huddle.com`
  - Redirect URLs: `https://www.gift-huddle.com/auth/callback`
- Facebook Developer console → **Valid OAuth Redirect URIs**:
  `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback`

Flow
----
1. User clicks Google/Facebook → `/auth/signin?provider=...&next=/account`
2. Route handler asks Supabase for the provider URL and returns **303** to it.
3. Provider → Supabase (GoTrue) → **your** `/auth/callback?code=...&next=/account`
4. `/auth/callback` calls `exchangeCodeForSession(code)` and sets cookies → **303** to `/account`.
5. `/api/debug/auth` shows cookie presence and `getUser()` result.