-- sql/profiles.sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  birthdate date,
  birth_day int,
  birth_month int,
  hide_birth_year boolean default true,
  fb_id text unique,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where polname = 'profiles_select_own'
  ) then
    create policy "profiles_select_own" on public.profiles
      for select using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where polname = 'profiles_upsert_own'
  ) then
    create policy "profiles_upsert_own" on public.profiles
      for insert with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where polname = 'profiles_update_own'
  ) then
    create policy "profiles_update_own" on public.profiles
      for update using (auth.uid() = id) with check (auth.uid() = id);
  end if;
end $$;
