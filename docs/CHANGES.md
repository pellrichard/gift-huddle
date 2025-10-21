# Patch – OAuth callback upsert + onboarding gate (2025-10-21)

- **Callback (/auth/callback)** now upserts:
  - `profiles`: id, full_name, email, avatar_url, preferred_currency; defaults `notify_mobile` & `notify_email` = **true** (insert or when missing).
  - `profiles_public`: id, full_name, email, avatar_url.
  - Redirects to **/onboarding** if `dob` is missing, else to `next` (default `/account`).

- **Account page** simplified to just read the profile; no duplicate ensure.

- **Locale → currency** mapping expanded (EUR for EU, USD for US, etc.; fallback **GBP**).

Files changed:
- `src/lib/locale.ts`
- `src/actions/profile.ts`
- `app/auth/callback/route.ts`
- `app/account/page.tsx`
