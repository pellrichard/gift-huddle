### 2025-10-04 – Harden OAuth flow (login → provider → callback)

- `/auth/signin` now constructs `redirectTo` from the **request origin** to avoid localhost or wrong-domain leaks.
- Two supported providers: **google**, **facebook**. Unknown provider → 400.
- `/auth/callback` simply redirects to `next` (default `/account`). Supabase sets cookies on callback automatically.
- `/login` page now renders explicit provider buttons that hit `/auth/signin?provider=...`.
- `middleware.ts` updated to **never** intercept `/auth/*` and `/api/*` routes to avoid redirect loops before cookies are set.
