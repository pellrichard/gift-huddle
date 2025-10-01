# Migration: add categories & preferred_shops to profiles (2025-10-01)

This aligns the DB with the onboarding flow.

## What it does
- Creates `public.profiles` if missing (id uuid PK → `auth.users.id`).
- Adds columns (idempotent):
  - `categories text[] default '{}'`
  - `preferred_shops text[] default '{}'`
- Enables RLS and adds self `INSERT`/`UPDATE` policies.

## How to apply
### Option A — Supabase Studio (SQL Editor)
1. Open your project → SQL editor.
2. Paste contents of `supabase/migrations/20251001_add_profiles_categories.sql`.
3. Run.

### Option B — Supabase CLI
```
supabase db push
```
(Ensure the `supabase/` folder is at your repo root and your CLI is linked.)

## After applying
- Retry `/onboarding` → pick values → Save. You should land on `/account`.
- Table Editor → `profiles`: confirm your row shows arrays in `categories` & `preferred_shops`.
