# BACKLOG

## Daily Notes – 2025-10-01

- Migrated auth to **@supabase/ssr** (callback, middleware, server, client).
- Fixed login loop: cookies now persist; account page sees session.
- Hardened middleware with try/catch and path scoping for `/account` + `/onboarding`.
- Type + lint fixes for Next 15 cookie typings; build passes locally.

### 📌 End of Day Summary
- **Auth flow stabilized**: OAuth → callback (200 page) → cookies → SSR → `/account` works.
- **Consistency**: Unified on `@supabase/ssr` across client, server, middleware.
- **Resilience**: Middleware narrowed to auth-critical paths; avoids 500s on edge.

## ✅ Completed

### 2025-10-01
- Migrate OAuth callback to `@supabase/ssr` with writable cookie adapter (return 200 landing page).
- Replace middleware with SSR version; add resilient guards + try/catch.
- Client migration to `createBrowserClient` (`@supabase/ssr`).
- Server helper refactor; provide `createClient()` back-compat; route-handler writer helper.
- Next 15 cookie typing & ESLint fixes; successful build.

## ⚠️ Outstanding
- QA: Onboarding gate — redirect to `/onboarding` when profile incomplete.
- QA: Logout route — ensure cookies are cleared; consider using `createRouteHandlerSupabase(req, res)` for explicit cookie writes.
- Supabase Auth → Redirect URLs: confirm production + preview domains are configured.
- Repo cleanup: remove any remaining references to `@supabase/auth-helpers-nextjs` and dead code.
- Preview deployment check: confirm cookies persist on preview URLs.

---

## 🤖 Context
- Working rules documented in `WORKING_RULES.md` (project-wide).
