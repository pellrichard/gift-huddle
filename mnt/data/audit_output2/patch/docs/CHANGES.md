# Patch – Surgical Code Fixes (2025-10-21)

## Summary

- Ensures a **profiles** row is created/backfilled on first OAuth login (idempotent).
- Populates **full_name** and **email** from Supabase user metadata (falls back to email prefix for name).
- Sets **preferred_currency** from **Accept-Language**; **fallback = GBP** per project requirement.
- Calls the ensure step in **/app/auth/callback** and defensively on **/app/account** page.
- Scrubs hidden control characters from TS/TSX sources.
- Deduplicates `next/navigation` imports in login/account pages if they were duplicated.

## Notes

- The ensure step uses a server-side Supabase client wired to Next.js cookies (`getAll`/`setAll`) to avoid auth regressions.
- If your `profiles` table has stricter columns, the insert uses a minimal set: `id, full_name, email, preferred_currency, avatar_url, updated_at`.
- RLS: assumes policies allow the authenticated user to `insert/update` their own `profiles` row.

## Files Changed / Added

- `src/lib/locale.ts`
- `src/actions/profile.ts`
- `app/auth/callback/route.ts`
- `app/account/page.tsx`
- `supabase/types.ts`
