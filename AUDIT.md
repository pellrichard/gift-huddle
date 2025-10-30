# Gift Huddle — Static Repo Audit

_Generated: 2025-10-01T20:43:40.648420Z_

## Repo Overview

- Root: `/mnt/data/repo/gift-huddle-main`
- Files: **241** (~10.27 MB)
- Next.js config present: **False**
- TypeScript: **True**
- Pages discovered: **9**

### Routes (page.tsx/page.jsx)

- `app/page.tsx`
- `app/account/page.tsx`
- `app/features/page.tsx`
- `app/how-it-works/page.tsx`
- `app/login/page.tsx`
- `app/onboarding/page.tsx`
- `app/privacy/page.tsx`
- `app/sign-in/page.tsx`
- `src/app/page.tsx`

## Potential secrets (verify & rotate if real)

- README.md: `EXT_PUBLIC_SUPABASE_URL` - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - OAuth `
- README_CLIENT_PATCH.md: `UBLIC_SUPABASE_URL` - `NEXT_PUBLIC_SUPABASE_ANON_KEY` That’s `
- README_COMBO_PATCH.md: `EXT_PUBLIC_SUPABASE_URL` - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ## Vali`
- README_INSTALL.md: `UBLIC_SUPABASE_URL` - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 8. \*\*Op`
- README_INSTALL_PATCH.md: `\_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... ```
- README_INSTALL_SUPABASE_TYPES.md: `EXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... ```  `
- middleware.ts: `   const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;   if (!u`
- app/(auth)/login/LoginButtons.tsx: `UPABASE_URL!,   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! );  expo`
- app/account/ConnectProviders.tsx: `_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),     []`
- app/auth/callback/route.ts: `ABASE_URL!,     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,     { c`
- docs/INSTALL.md: `\_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... ```
- lib/supabase/browser.ts: `UPABASE_URL!,   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,   { coo`
- src/app/api/waitlist/route.ts: `PUBLIC_SUPABASE_URL!,       process.env.SUPABASE_SERVICE_ROLE_KEY! // s`
- src/lib/supabaseClient.ts: `pabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  export `
- src/lib/supabase/client.ts: `UPABASE_URL!,   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,   // Ke`
- src/lib/supabase/server.ts: `ABASE_URL!,     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,     { c`
- src/lib/supabase/server.ts: `ABASE_URL!,     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,     { c`

## Missing asset references

- docs/README_APPLY.md → `/public/hero-placeholder.svg` for your real image at `/public/hero.jpg` not found under `/public` or repo root
- documentation/CONTRIBUTING.md → `/public/logo.webp` not found under `/public` or repo root
- documentation/README.md → `/public/logo.webp` not found under `/public` or repo root
- documentation/README.md → `/public/logo.webp` not found under `/public` or repo root
- documentation/README.md → `/public/logo.webp` not found under `/public` or repo root
- documentation/RELEASE.md → `/public/logo.webp` not found under `/public` or repo root
- documentation/brand/logo-guidelines.md → `/public/logo.webp` not found under `/public` or repo root
- documentation/brand/logo-guidelines.md → `/public/logo-icon.webp` not found under `/public` or repo root
- documentation/brand/logo-guidelines.md → `/public/favicon.*` not found under `/public` or repo root

## TODO/FIXME trail (first 50)

- src/components/account/ProfileBanner.tsx:19 — TODO — try { ⏎ // TODO: upload file to storage, update profile.banner_url ⏎ await new Promise((r) => setTimeout(r, 300));
- src/components/account/ProfileBanner.tsx:31 — TODO — try { ⏎ // TODO: upload file to storage, update profile.avatar_url ⏎ await new Promise((r) => setTimeout(r, 300));

---

## OAuth → Profile audit (2025-10-08)

**Problem:** Profiles were created with empty data (only `id`).  
**Root causes:**

- DB trigger `handle_new_user` was inserting only `id`.
- App code upserted **display_name** / **dob_show_year** which do not exist in the canonical schema (`full_name` / `show_dob_year`).
- Mixed column names across UI and actions caused updates to silently fail.

**Fixes in this patch:**

- Normalize to `full_name` and `show_dob_year` across server actions, API route, UI form, and types.
- Add safe SQL migration (`sql/2025-10-08_profiles_safe_align.sql`) to rename columns if your DB still uses legacy names.
- Add trigger migration (`sql/2025-10-08_profiles_bootstrap_trigger.sql`) to populate `email`, `full_name`, `avatar_url` from `auth.users.raw_user_meta_data` on first sign-in.
- Ensure Account dashboard auto-opens Edit Profile when **full_name**, **dob**, or **preferred_currency** are missing (this already existed and remains).

**Mandatory check flow (now canonical):**

1. OAuth callback sets session.
2. First load of `/account` calls `bootstrapProfileFromAuth()` (server) to ensure profile exists and is hydrated from OAuth metadata.
3. UI auto-opens Edit Profile if any of: `full_name`, `dob`, `preferred_currency` are missing.

**Next steps:**

- Run the two SQL files under `/sql` in Supabase SQL editor.
- Redeploy. Test Google & Facebook logins and confirm profile auto-populates name/avatar/email.
