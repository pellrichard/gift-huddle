### 2025-10-04 – Callback writes cookies to the **response**

- Replaced callback handler to use `createServerClient` with a custom cookies adapter that
  **reads from** `next/headers` cookies and **writes to** `NextResponse.cookies`.
- This ensures `exchangeCodeForSession(code)` sets the `sb-*` cookies on the redirect response,
  fixing the post-login loop (`/account` → `/login`) caused by missing session cookies.
