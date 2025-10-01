# Patch Notes — Auth cleanup (2025-10-01)

## What changed
- `app/account/page.tsx`: 
  - Import now: `@/src/lib/supabase/server`
  - Removed manual token reconstruction from `sb-*-auth-token.0` cookies.
  - Simple guard: if no session → `redirect("/login")`.
- `app/auth/callback/route.ts`:
  - Safe default redirect now `/account` when `?next` is absent or unsafe.
- `BACKLOG.md` updated with today’s notes.

## Apply the patch
1. Unzip `gift-huddle-patch.zip` **into your repo root**, allowing it to overwrite files.
2. Ensure environment vars are set in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy (or `npm run dev` locally) and test:
   - Login with Google/Facebook
   - You should land at `/account` and stay signed in
   - Navigating directly to `/account` should read the SSR session and render.

## Follow-ups (recommended)
- Consolidate to a single app root (prefer `src/app/`) and remove top-level `app/` after verifying no unique routes.
- Remove `lib/supabase/browser.ts` once all imports point to `@/src/lib/supabase/client`.
- Add security headers in `next.config.*` if not present (CSP, HSTS, etc.).

- Correction: import path in `app/account/page.tsx` now `@/lib/supabase/server`.
