# Gift Huddle — Diff Patch: Supabase typing & profile bootstrap

## Files in this patch

- `src/lib/supabase/server.ts` — typed, non-async `createClient()` for route handlers.
- `app/api/profile/route.ts` — uses **typed `upsert`** to bootstrap a profile on GET and a typed POST update.

## How to apply

1. Unzip and copy files into your repo preserving the paths above.
2. Ensure deps:
   ```bash
   npm i @supabase/supabase-js @supabase/auth-helpers-nextjs
   ```
3. Check env:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Clean and rebuild:
   ```bash
   rm -rf .next tsconfig.tsbuildinfo
   npm run build
   ```

## Why this fixes your error

The previous `profiles.insert(...)` triggered TypeScript `never` overload errors because the client/table wasn't typed at the callsite. `createClient()` is now generically typed with your `Database`, and the route uses `upsert({ id }, { onConflict: "id" })` which matches the `Insert` type for `profiles`.
