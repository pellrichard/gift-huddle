# Gift Huddle – Login Loop Combo Patch (Callback + Middleware)

This patch includes:

1. **app/auth/callback/route.ts** — Uses `@supabase/ssr` with a **writable cookie adapter** and returns a **200 landing page** to ensure `Set-Cookie` lands reliably.
2. **middleware.ts** — Switches to `@supabase/ssr` with the same writable adapter and optionally guards `/account`.

## Apply

Copy files to the same paths in your repo:

- `app/auth/callback/route.ts`
- `middleware.ts`

Then commit & deploy.

## Supabase Settings

**Authentication → URL Configuration → Redirect URLs**
Add all domains that will hit the callback:

- `https://gift-huddle.com/auth/callback`
- `https://www.gift-huddle.com/auth/callback`
- Your preview pattern, e.g. `https://*-gift-huddle.vercel.app/auth/callback`

## Vercel Env Vars

Ensure these are set for all environments:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Validate

1. Sign in with Google or Facebook.
2. The callback returns a brief "Signing you in…" page, then forwards to `/account` (or `next=`).
3. In DevTools → Application → Cookies, confirm:
   - `sb-…-auth-token`
   - `sb-…-refresh-token`
4. Visiting `/account` should render (or redirect to `/login?next=…` if you aren’t signed in).

## Notes

- Do **not** set `Domain=` on cookies unless you need cross-subdomain. Defaults are safest.
- If you prefer guards only in server routes/pages, remove the `/account` redirect block from `middleware.ts`.
- This patch doesn’t touch your existing `lib/supabase/server.ts` which already uses `@supabase/ssr`.
