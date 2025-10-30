# Force PKCE via query param

- Added `options.queryParams = { flow_type: 'pkce' }` in `/auth/signin`.
- This instructs Supabase GoTrue to use the Authorization Code (PKCE) flow so your app's `/auth/callback` receives `?code=...`.
- No type errors (it's part of `queryParams` bag).

Retest:

- Start from `/login`, choose a provider.
- On return, `/auth/callback` should include `?code=...` and HAR will show header `X-OAuth-Debug: has_code`.
