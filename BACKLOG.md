### 2025-10-04 – Use createRouteHandlerClient in /auth/callback

- Switched callback to `createRouteHandlerClient({ cookies })` from `@supabase/ssr`.
- This is required so the **Supabase auth cookies are actually written** during `exchangeCodeForSession(...)`.
- HAR shows: `/auth/v1/callback` -> `/auth/callback` -> `/account` (without Set-Cookie) -> `/login` loop.
  This change resolves the missing Set-Cookie.
