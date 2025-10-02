# Login fixes: Facebook provider + relative links

- Allowed `facebook` in `app/auth/signin/route.ts` (ensure Facebook is enabled in Supabase Auth).
- Updated `app/login/page.tsx` to use **relative** links (`/auth/signin?...`) so it never points to localhost in production.
- Added a Facebook button alongside Google and Apple.

_Updated 2025-10-02T18:20:45.831669Z_
