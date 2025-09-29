-- 2025-09-29: Profile media (avatar & banner) + storage policies

-- Extend profiles with avatar & banner URLs
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists banner_url text;

-- Create public storage bucket for profile assets (if not exists)
insert into storage.buckets (id, name, public)
select 'profile-assets', 'profile-assets', true
where not exists (select 1 from storage.buckets where id = 'profile-assets');

-- Enable RLS on storage.objects (already enabled by default in Supabase)
-- Policies for 'profile-assets' bucket
drop policy if exists "profile_assets_public_read" on storage.objects;
create policy "profile_assets_public_read" on storage.objects
  for select
  using (bucket_id = 'profile-assets');

drop policy if exists "profile_assets_user_insert" on storage.objects;
create policy "profile_assets_user_insert" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'profile-assets' and owner = auth.uid());

drop policy if exists "profile_assets_user_update" on storage.objects;
create policy "profile_assets_user_update" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'profile-assets' and owner = auth.uid());

drop policy if exists "profile_assets_user_delete" on storage.objects;
create policy "profile_assets_user_delete" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'profile-assets' and owner = auth.uid());
