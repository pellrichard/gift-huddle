# Changelog

## v0.1.3 — 2025-10-01

### Added

- **Onboarding UPSERT flow**: creates/updates `profiles` with `categories` & `preferred_shops`.
- **Edit bypass**: `/onboarding` redirects to `/account` if already complete unless `?edit=1`.
- **Manage preferences**: link on `/account` → `/onboarding?edit=1`.
- **DB migrations**: ensure `categories`, `preferred_shops`, `updated_at` + trigger, and RLS policies.

### Fixed

- OAuth login loop into onboarding; missing columns/policies causing silent failures.

### Ops

- Production route logs only errors; dev keeps detailed request logs.
