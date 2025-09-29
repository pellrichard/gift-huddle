-- 2025-09-29: Events schema for Gift Huddle

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  event_date date not null,
  event_type text check (event_type in ('birthday','anniversary','holiday','other')) default 'other',
  notes text,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

-- Policies: users can only act on their own events
drop policy if exists "events_select_own" on public.events;
create policy "events_select_own" on public.events
  for select using (auth.uid() = user_id)
  to authenticated;

drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events
  for insert with check (auth.uid() = user_id)
  to authenticated;

drop policy if exists "events_update_own" on public.events;
create policy "events_update_own" on public.events
  for update using (auth.uid() = user_id)
  to authenticated;

drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own" on public.events
  for delete using (auth.uid() = user_id)
  to authenticated;
