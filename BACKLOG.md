### 2025-10-04 – Type-safe cookie write in OAuth callback

- Removed `@ts-expect-error` and inferred `CookieOptions` from `response.cookies.set` signature.
- Callback still writes Supabase `sb-*` cookies onto the redirect response and fixes the login loop.
