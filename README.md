# Auth Debug SSR Patch
This patch removes any client-side cookie parsing and ensures `/account` resolves
the session on the **server** using `@supabase/ssr`.

## Files
- `lib/supabase/server.ts` — SSR client with cookie adapter
- `lib/supabase/browser.ts` — Browser client (not used on `/account` page)
- `app/account/page.tsx` — Server component that calls `supabase.auth.getSession()` and prints debug info

## Apply
Unzip at repo root and run:
```bash
npm run build && npm run start
```

Open `/account` after logging in. If the page still says not signed in, copy the "Auth debug" box and we can trace further.
