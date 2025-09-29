-- 2025-09-29: Onboarding schema (profiles + friend requests)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  dob date,
  dob_show_year boolean default false,
  categories text[] default '{}',
  preferred_shops text[] default '{}',
  socials jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references auth.users (id) on delete cascade,
  addressee uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz default now(),
  unique (requester, addressee)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.friend_requests enable row level security;

-- Profiles policies: users can view their own profile, and others' basic data (read-only), but update only own.
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for insert with check (auth.uid() = id)
  to authenticated;

create policy "profiles_modify_own" on public.profiles
  for update using (auth.uid() = id)
  to authenticated;

-- Friend requests policies: involved users can read; requester can create; addressee can update status.
drop policy if exists "fr_select_involved" on public.friend_requests;
create policy "fr_select_involved" on public.friend_requests
  for select using (auth.uid() = requester or auth.uid() = addressee)
  to authenticated;

drop policy if exists "fr_insert_requester" on public.friend_requests;
create policy "fr_insert_requester" on public.friend_requests
  for insert with check (auth.uid() = requester)
  to authenticated;

drop policy if exists "fr_update_addressee" on public.friend_requests;
create policy "fr_update_addressee" on public.friend_requests
  for update using (auth.uid() = addressee)
  to authenticated;

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
