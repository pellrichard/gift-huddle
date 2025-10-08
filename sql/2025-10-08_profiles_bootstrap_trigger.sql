-- 2025-10-08: Populate profiles from auth.users on creation (email/full_name/avatar_url)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  meta jsonb;
  name text;
  avatar text;
begin
  meta := new.raw_user_meta_data;
  name := coalesce(meta->>'full_name', meta->>'name', new.email);
  avatar := coalesce(meta->>'avatar_url', meta->>'picture', null);

  insert into public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
  values (new.id, new.email, name, avatar, now(), now())
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
