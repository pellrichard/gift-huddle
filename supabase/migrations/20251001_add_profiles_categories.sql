-- 2025-10-01 Add categories & preferred_shops to public.profiles
-- Safe to run multiple times (IF NOT EXISTS guards).

begin;

-- Ensure the table exists (no-op if already there)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  updated_at timestamp with time zone default now()
);

-- Align schema with app expectations
alter table public.profiles
  add column if not exists categories text[] default '{}'::text[],
  add column if not exists preferred_shops text[] default '{}'::text[];

-- Enable RLS and policies for self insert/update
alter table public.profiles enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles-insert-own'
  ) then
    create policy "profiles-insert-own"
    on public.profiles for insert
    with check (id = auth.uid());
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles-update-own'
  ) then
    create policy "profiles-update-own"
    on public.profiles for update
    using (id = auth.uid())
    with check (id = auth.uid());
  end if;
end $$;

commit;
