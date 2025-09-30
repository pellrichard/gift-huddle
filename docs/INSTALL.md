# Gift Huddle – Auth Callback Fix (Patch)

This patch replaces `app/auth/callback/route.ts` to fix a Turbopack build error
(`cannot reassign to a variable declared with const`) and solidify the Supabase
PKCE exchange + cookie setting in Next.js 15.

## Apply the patch
1. Unzip this archive at the repo root so that the file paths line up:
   - `app/auth/callback/route.ts`
2. Install deps and run locally:
   ```bash
   npm i
   npm run dev
   ```
3. Ensure these **env vars** are present (Vercel + `.env.local`):
   ```ini
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

## Supabase settings (double-check)
- **Site URL:** `https://www.gift-huddle.com`
- **Additional Redirect URLs:** `/auth/callback`
- If using social providers (Google/Facebook/Apple), also include your
  project callback: `https://<PROJECT_REF>.supabase.co/auth/v1/callback`

## Redirects used
- Login / link flows should use: `/auth/callback?next=/account`

## Why this fixes the build
- The previous implementation reassigned a `const` variable (`res`). This file
  uses straight `return NextResponse.redirect(...)` to avoid reassignment.
- It also wraps cookie handling using `@supabase/ssr`'s `createServerClient`
  with Next 15 route-handler compatible cookie adapters.

## Notes
- Open-redirects are prevented: only relative `next` values are allowed.
- On error, we append `link_error` to the redirect target for UI toasts.
