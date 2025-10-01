# Gift Huddle – Backlog & Daily Notes

### 2025-10-01

- Onboarding/profile gate aligned to existing schema (`categories`, `preferred_shops`).
## 2025-10-01
- Static audit generated (AUDIT.md). Placeholder images created for missing assets (including `/public/images/hero.webp`). 
- Fixed TS build error by removing `ProfileGate` generic from Supabase `.from('profiles')` calls.
- Added `@supabase/ssr` to dependencies (no breaking code changes yet).

### End-of-day summary
Auth loop persists (likely cookie/session config). DB policy errors (e.g., `updated_at` and `is_shared`) require SQL-side fixes; not patched here. Next steps: migrate to `@supabase/ssr`, review middleware/session cookies, and align DB schema with code (profiles fields, events policies).
- Footer socials limited to Facebook + LinkedIn; removed placeholders.
- Fixed ESLint warning on Contact page (removed unused import).
- Fixed Next 15 cookies() typing by awaiting cookies() in home redirect.
- Header: logout now clears client session and redirects to the homepage after server sign-out.
- Added /privacy page to match footer link.
- Introduced middleware-based auth routing:
  - Redirect authed users away from /login and /signup to /account.
  - Protect /account for unauthenticated users.
- Added SQL migration to align DB schema: profiles.categories, updated_at triggers, events & event_participants with RLS.
- Fixed ESLint rule in debug page by adding proper TypeScript types (no `any`).
- OAuth callback now binds to route-handler response; cookies are written during exchange and preserved on redirect to /account.
- Fixed ESLint prefer-const in auth callback (use const res instead of let).
- Account page scaffolded with server-rendered overview, Preferences form (categories/budget/sizes), connected accounts list, and security block.
