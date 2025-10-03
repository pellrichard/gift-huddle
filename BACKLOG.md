### 2025-10-04 – Fix logout (405) and account page visibility

- **Logout 405**: Header now submits a POST to `/logout` via a form button.
  Added `app/logout/route.ts` to call `supabase.auth.signOut()` and redirect to `/login`.
- **Account page**: Rewrote `app/account/page.tsx` to verify session on the server.
  - If no user → redirect to `/login`.
  - If user exists → render a minimal, reliable account page (email + raw user JSON) and mount `AccountClient`.
- Header remains auth-aware and continues to use `/logo.svg` for branding.
