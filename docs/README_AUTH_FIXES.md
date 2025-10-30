# Gift Huddle — OAuth Patch (Build Fixes)

This patch fixes the Vercel build errors you saw:

1. **Conflicting route and page at `/auth/callback`**  
   -> We remove the `route.ts` approach and provide a `page.tsx` redirect page instead. If you already have a callback page, keep only one (ours replaces it).

2. **Cannot find module `@tailwindcss/postcss`**  
   -> Adds `@tailwindcss/postcss` and ensures `postcss` + `autoprefixer` are present.

3. **Path alias `@/lib/...` not resolving**  
   -> Your project aliases `@/*` to `./src/*`. We moved Supabase clients into `src/lib/...` so imports like `@/lib/supabase/client` work.

## Apply

1. Drop these files into your repo root (merge).
2. Ensure there is **no** `app/auth/callback/route.ts` (delete it if present).
3. Run `npm i` and redeploy.

## Notes

- Callback page does a quick client redirect to `/app` (or `next` query param).
- Middleware continues to protect `/app/**` only.
