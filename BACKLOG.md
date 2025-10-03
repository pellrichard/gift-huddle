### 2025-10-04 – Fix OAuth loop by exchanging code for session

- Updated `app/auth/callback/route.ts` to call `supabase.auth.exchangeCodeForSession(code)`.
- This **sets the Supabase auth cookies** on the server response so the user is actually signed in.
- Without this step, the app redirected to `/account` without a session, then got bounced back to `/login` (loop).
