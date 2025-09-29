# Gift Huddle — Fixed Components Drop-In (Team Notes)

This bundle contains ready-to-replace files that clear our current ESLint/TS build failures
and most warnings reported by Vercel.

## What changed
- Replaced `<img>` with `next/image` (Footer, Header, Recommendations, AccountPage).
- Removed unused `ProfileSummary` import in `AccountPage`.
- Fixed hooks dependency warnings in `EventsSection` (`useCallback`, include `fetchEvents`, `supabase.auth`, and `today`).
- Added missing dep in `ProfileSummary` (`supabase`).
- Removed `any` in `ProfileBanner` (typed boolean state + `React.ChangeEvent<HTMLInputElement>`).
- Added `SmartImage.tsx` (enforces `alt` prop).

## How to install (commit directly to `main`)
1. Unzip into the repo root and overwrite the existing files:
   - `app/components/Footer.tsx`
   - `app/components/Header.tsx`
   - `app/components/Recommendations.tsx`
   - `src/components/account/AccountPage.tsx`
   - `src/components/account/EventsSection.tsx`
   - `src/components/account/ProfileSummary.tsx`
   - `src/components/account/ProfileBanner.tsx`
   - `src/components/ui/SmartImage.tsx`

2. Commit and push:
   ```powershell
   git add -A
   git commit -m "Replace components with fixed versions (ESLint/TS cleanup)"
   git push
   ```

3. Verify locally (optional):
   ```bash
   npm run lint
   npm run build
   ```

## Sanity checks
- Search for any leftover `<img`:
  ```powershell
  Select-String -Path .\app\components\Footer.tsx, .\app\components\Header.tsx, .\app\components\Recommendations.tsx, .\src\components\account\AccountPage.tsx -Pattern "<img"
  ```
- Ensure `ProfileBanner.tsx` no longer contains `any`:
  ```powershell
  Select-String -Path .\src\components\account\ProfileBanner.tsx -Pattern "any"
  ```
- Ensure `AccountPage.tsx` does not import `ProfileSummary` unless it's used:
  ```powershell
  Select-String -Path .\src\components\account\AccountPage.tsx -Pattern "ProfileSummary"
  ```

## Supabase client note
`EventsSection.tsx` and `ProfileSummary.tsx` include a minimal `createClient` placeholder. If we already have a project-standard client (e.g., `@/lib/supabase/client` or similar), **switch to that import** and remove the local `createClient` lines. Example:
```ts
// import { createClient } from "@supabase/supabase-js"; // remove
import { supabase } from "@/lib/supabase/client"; // or our actual path
```
Then update calls from `createClient(...).from(...)` accordingly if needed.

## Rollback
Backups recommended before overwrite. If needed, `git checkout -- <path>` to restore any specific file from HEAD.
