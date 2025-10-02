# Fix login/account redirect loop

**Symptoms:** after OAuth callback, header shows logged-in but visiting `/account` bounces back to `/login`.

**Fixes in this patch**
- `app/account/page.tsx`: SSR fetches `supabase.auth.getUser()` with `dynamic="force-dynamic"` and `revalidate=0` to avoid cache; redirects to `/login?next=/account` only when unauthenticated.
- `app/login/page.tsx`: If already authenticated, immediately redirects to `/account` instead of re-prompting OAuth.
- `app/api/debug/session`: Quick endpoint to verify server-side session visibility.

**How to validate**
1. Deploy and visit `/api/debug/session` → you should see `user` and `session` objects after login.
2. Visit `/login` while logged in → should redirect to `/account`.
3. Visit `/account` after OAuth → should render account page, no loop.

_Updated 2025-10-02T17:56:38.846138Z_
