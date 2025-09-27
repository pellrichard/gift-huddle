-- 03_profiles_add_missing_cols_and_view.sql
-- Adds any missing columns we use; recreates public view; enables RLS and owner policies.

do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='email')
  then alter table public.profiles add column email text; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='hide_birth_year')
  then alter table public.profiles add column hide_birth_year boolean not null default true; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='fb_picture_url')
  then alter table public.profiles add column fb_picture_url text; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='fb_id')
  then alter table public.profiles add column fb_id text; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='fb_last_sync')
  then alter table public.profiles add column fb_last_sync timestamptz; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='permissions_granted')
  then alter table public.profiles add column permissions_granted text[] not null default '{}'; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='interests')
  then alter table public.profiles add column interests text[] default '{}'; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='preferred_shops')
  then alter table public.profiles add column preferred_shops text[] default '{}'; end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='dob')
  then alter table public.profiles add column dob date; end if;

  -- Drop gender if it exists (no longer used)
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='gender')
  then alter table public.profiles drop column gender; end if;
end $$;

create or replace view public.profiles_public as
select
  id,
  full_name,
  email,
  case
    when dob is null then null
    when hide_birth_year then to_char(dob, 'DD Mon')
    else to_char(dob, 'DD Mon YYYY')
  end as birthday_display,
  fb_picture_url,
  interests,
  preferred_shops
from public.profiles;

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='profiles_owner_read'
  ) then
    create policy "profiles_owner_read" on public.profiles
      for select using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='profiles_owner_update'
  ) then
    create policy "profiles_owner_update" on public.profiles
      for update using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles' and policyname='profiles_owner_insert'
  ) then
    create policy "profiles_owner_insert" on public.profiles
      for insert with check (auth.uid() = id);
  end if;
end $$;

grant select on public.profiles_public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
