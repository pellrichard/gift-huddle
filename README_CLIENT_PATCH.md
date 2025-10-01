# Gift Huddle – Client Patch (`@supabase/ssr` browser)

This patch migrates the client-side Supabase instance to **`@supabase/ssr`**.

## What changes

- Replaces `createClientComponentClient` from `@supabase/auth-helpers-nextjs`
  with `createBrowserClient` from `@supabase/ssr`.
- Provides two files to cover existing imports:
  - `src/lib/supabase/client.ts`  (used by `@/lib/supabase/client`)
  - `lib/supabase/browser.ts`      (if any code imports this path)

## Apply

Copy these files into your repo at the same paths:
- `src/lib/supabase/client.ts`
- `lib/supabase/browser.ts`

Then commit & deploy.

## Follow‑ups (optional cleanup)

1. **Dependencies**
   - Ensure `@supabase/ssr` is installed.
   - Optionally remove `@supabase/auth-helpers-nextjs` if no longer used:
     ```
     npm remove @supabase/auth-helpers-nextjs
     ```
     (Not required for this patch to work.)

2. **Imports**
   - Your login page already imports `@/lib/supabase/client` — no changes needed.
   - If you have any legacy imports like `@/lib/supabase/browser`, they’ll work too.

3. **Environment**
   - Confirm env vars are set in Vercel:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

That’s it. With the earlier **callback + middleware** patches, the client now matches the same library, reducing edge cases.
