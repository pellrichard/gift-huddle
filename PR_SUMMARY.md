
# Gift Huddle – End of Day PR

**Date:** 2025-10-08 22:14:38

## Summary
- Reliable **first-login bootstrap**: creates/patches `profiles` row from OAuth (display name + avatar).
- **GBP default** for UK; header/locale-based currency detection for other regions.
- **No `any`**: strict types via a small typed facade over the Supabase client.
- Re-introduced **`saveProfile`** server action with mandatory-field validation (full name, DOB, preferred currency).
- `app/account/page.tsx` now calls `bootstrapProfileFromAuth()` before rendering, and maps types safely for `AccountDashboard`.
- Keeps Next.js server action constraints, and uses `revalidatePath('/account')` after writes.

## Changed files
- `src/actions/profile.ts`
- `app/account/page.tsx`

## How to test
1. Log in with a fresh user via OAuth.
2. Visit **/account** — the profile row should be created immediately with:
   - `display_name` from OAuth metadata (or email fallback)
   - `avatar_url` from OAuth metadata
   - `preferred_currency` derived from headers/locale (UK → GBP)
3. Open **Edit Profile** and try saving without full name, DOB, or preferred currency → save should be blocked with a clear error.
4. Complete the fields and save → page revalidates and persists changes.
5. Sign out and back in → fields should be present without needing a manual refresh.

## Notes / Next steps
- If you want browser **geolocation** to refine currency choice client-side, we can add a one-time prompt and post the detected country to the server (kept out of this PR to avoid UX friction).
- If your `profiles` table has different columns, tweak `ProfilesRow` to match (it’s intentionally minimal).

## SQL policies (confirm these exist)
```sql
-- insert: user can insert own row
create policy "profiles_insert_self"
  on profiles for insert to authenticated
  with check ( auth.uid() = id );

-- update: user can update own row
create policy "profiles_update_self"
  on profiles for update to authenticated
  using ( auth.uid() = id )
  with check ( auth.uid() = id );
```
