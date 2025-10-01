# Gift Huddle – Backlog & Daily Notes

### 2025-10-01

- Onboarding/profile gate aligned to existing schema (`categories`, `preferred_shops`).
## 2025-10-01
- Static audit generated (AUDIT.md). Placeholder images created for missing assets (including `/public/images/hero.webp`). 
- Fixed TS build error by removing `ProfileGate` generic from Supabase `.from('profiles')` calls.
- Added `@supabase/ssr` to dependencies (no breaking code changes yet).

### End-of-day summary
Auth loop persists (likely cookie/session config). DB policy errors (e.g., `updated_at` and `is_shared`) require SQL-side fixes; not patched here. Next steps: migrate to `@supabase/ssr`, review middleware/session cookies, and align DB schema with code (profiles fields, events policies).
