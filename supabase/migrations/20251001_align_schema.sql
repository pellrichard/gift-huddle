-- 2025-10-01 Align schema with app expectations

-- profiles.categories JSONB (nullable)
do $$ begin
  if not exists (select 1 from information_schema.columns
                 where table_schema='public' and table_name='profiles' and column_name='categories') then
    alter table public.profiles add column categories jsonb;
  end if;
end $$;

-- Ensure updated_at column and trigger
do $$ begin
  if not exists (select 1 from information_schema.columns
                 where table_schema='public' and table_name='profiles' and column_name='updated_at') then
    alter table public.profiles add column updated_at timestamp with time zone default now();
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'profiles_updated_at_trg') then
    create trigger profiles_updated_at_trg
    before update on public.profiles
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- events + participants (minimal)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_shared boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.event_participants (
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  role text default 'viewer',
  created_at timestamptz default now(),
  primary key (event_id, coalesce(user_id::text, email))
);

create or replace function public.set_updated_at_events()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'events_updated_at_trg') then
    create trigger events_updated_at_trg
    before update on public.events
    for each row execute function public.set_updated_at_events();
  end if;
end $$;

-- RLS policies (basic)
alter table public.events enable row level security;
alter table public.event_participants enable row level security;

-- owners can do anything
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='events' and policyname='owner_all') then
    create policy owner_all on public.events for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
  end if;
end $$;

-- shared read for participants
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='events' and policyname='participant_read') then
    create policy participant_read on public.events for select to authenticated using (
      is_shared = true and exists (
        select 1 from public.event_participants p
         where p.event_id = events.id and (
           p.user_id = auth.uid() or lower(p.email) = lower(coalesce(auth.jwt() ->> 'email',''))
         )
      )
    );
  end if;
end $$;

-- participants table policies
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='event_participants' and policyname='participant_self') then
    create policy participant_self on public.event_participants for all to authenticated using (
      user_id = auth.uid() or lower(email) = lower(coalesce(auth.jwt() ->> 'email',''))
    ) with check (
      user_id = auth.uid() or lower(email) = lower(coalesce(auth.jwt() ->> 'email',''))
    );
  end if;
end $$;
