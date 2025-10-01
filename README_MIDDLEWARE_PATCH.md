# Gift Huddle – Middleware SSR Patch

This patch switches **middleware.ts** to use `@supabase/ssr`, giving it a
**writable cookie adapter** so session refreshes write stable first‑party cookies.

## What it does
- Replaces `createMiddlewareClient` from `@supabase/auth-helpers-nextjs`
  with `createServerClient` from `@supabase/ssr`.
- Uses a request/response cookie adapter so cookies actually persist.
- Includes a *light* guard: unauthenticated requests to `/account`
  are redirected to `/login?next=/account`. (You can remove this section if you prefer.)

## Apply

1. Copy the file in this zip to your repo at the same path:

   - `middleware.ts`

2. Commit and deploy on Vercel.

3. Optional: If you manage auth gating inside the page/route instead,
   delete the `/account` guard block in the middleware.

## Notes

- This is additive with the earlier **/auth/callback** patch:
  - Callback now returns a 200 landing page (no 302) and writes cookies via SSR adapter.
  - Middleware refresh keeps cookies in sync on navigation.
