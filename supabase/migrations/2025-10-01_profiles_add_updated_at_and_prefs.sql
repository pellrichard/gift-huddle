-- 2025-10-01 Ensure updated_at + trigger, and prefs columns on public.profiles
begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

alter table public.profiles
  add column if not exists updated_at timestamp with time zone default now(),
  add column if not exists categories text[] default '{}'::text[],
  add column if not exists preferred_shops text[] default '{}'::text[];

create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

do $$ begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_profiles_updated_at'
  ) then
    create trigger set_profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.set_current_timestamp_updated_at();
  end if;
end $$;

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
