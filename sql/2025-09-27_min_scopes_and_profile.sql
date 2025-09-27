-- 2025-09-27: Minimize Facebook scopes; profile fields cleanup; add DOB + toggle.
-- Run this in your Supabase SQL editor or via migration tooling.

-- Drop unused columns if they exist (defensive).
alter table if exists public.profiles
    drop column if exists user_gender,
    drop column if exists user_likes,
    drop column if exists user_friends,
    drop column if exists user_birthday_src;

-- Ensure DOB fields exist.
alter table if exists public.profiles
    add column if not exists dob date,
    add column if not exists dob_hide_year boolean default true;

-- Basic RLS hint (adjust if your project uses different policies).
-- Ensure authenticated users can update their own profile.
create policy if not exists "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
