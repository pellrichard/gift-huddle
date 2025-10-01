# Gift Huddle

Production: https://www.gift-huddle.com

## What is this?
A Next.js app (App Router) with Supabase auth (Google/Facebook) and a simple onboarding flow that stores user preferences in `public.profiles` (`categories`, `preferred_shops`).

## Quick start
```bash
# env
cp .env.example .env.local
# dev
npm i
npm run dev
```

### Required env
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- OAuth providers configured in Supabase (redirects to `/auth/callback`).

## Database
Migrations live under `supabase/migrations/`. Apply via Studio (SQL editor) or CLI:
```bash
supabase db push
```

Columns expected on `public.profiles`:
- `id uuid primary key references auth.users(id)`
- `categories text[]`
- `preferred_shops text[]`
- `updated_at timestamptz` + trigger (`set_profiles_updated_at`)

RLS policies required:
```sql
create policy "profiles-insert-own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles-update-own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
```

## App routes
- `/account` – shows email; redirects to `/onboarding` until preferences are set.
- `/onboarding` – choose categories/shops. If already complete, redirect back to `/account` unless `?edit=1` is present.
- `POST /onboarding/update` – UPSERTs `profiles` with your choices and redirects to `/account?saved=1`.

## Dev notes
- Logging: production logs only errors in the route; dev logs include inputs and request IDs.
- TypeScript: the route uses a local type and a minimal cast at the callsite to avoid deep TS recursion in generated Supabase types.
