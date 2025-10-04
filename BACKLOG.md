### 2025-10-04 – ESLint: replace `any` in auth routes

- Replaced `any` with `Record<string, unknown>` in `/auth/signin` and `/auth/callback` cookie adapters.
- Inferred `CookieOptions` from `NextResponse.cookies.set` for safe typing.
- Functionality unchanged: PKCE cookies set on `/auth/signin`, session cookies set on `/auth/callback`.
