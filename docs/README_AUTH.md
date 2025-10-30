# Gift Huddle — Supabase OAuth Patch

This patch adds Supabase Auth (Google, Apple, Facebook), SSR session handling, and a minimal login flow.

## What’s included

- Supabase SSR client (server + browser)
- Middleware to keep sessions fresh and protect `/app/**`
- OAuth login page with Google/Apple/Facebook
- OAuth callback route
- Logout route
- SQL to create `profiles` table + trigger
- Example `.env.local.example`
- `package.json` dependencies matching Next.js 15.5.4

## Install

1. Copy contents of this patch into your repo root (merge files/directories).
2. Run:
   ```bash
   npm i
   ```
3. Create `.env.local` from `.env.local.example` and fill values.
4. In Supabase → Authentication → URL Configuration:
   - **Site URL:** `https://<your-domain>`
   - **Redirect URLs:**
     - `https://<your-domain>/auth/callback`
     - `http://localhost:3000/auth/callback`
5. In Supabase → Authentication → Providers: enable Google, Apple, Facebook and set the same redirect URLs.
6. Run SQL in `supabase/sql/01_profiles_and_trigger.sql` (SQL Editor).

## Route protection

- Middleware currently protects `/app/**`. Public routes like `/`, `/login`, `/auth/callback` remain open.

## TS path alias

The code uses `@/lib/...`. If your `tsconfig.json` doesn’t have it, merge the snippet in `tsconfig.additions.json` into your existing `tsconfig.json`.

## Smoke test

- Visit `/login` → click “Continue with Google”
- You should be redirected to `/auth/callback?next=/app` and then land in `/app`
- Check cookies `sb-...` are set (HttpOnly, SameSite=Lax)
