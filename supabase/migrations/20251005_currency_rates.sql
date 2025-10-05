-- Create latest snapshot table for current currency rates
create table if not exists public.currency_rates (
  code        text primary key check (char_length(code) = 3),
  name        text,
  rate        numeric not null check (rate > 0),
  base        text not null default 'USD' check (char_length(base) = 3),
  updated_at  timestamptz not null default now()
);

create index if not exists currency_rates_updated_at_idx
  on public.currency_rates(updated_at desc);

-- Enable RLS (service role will bypass)
alter table public.currency_rates enable row level security;

-- Allow all reads
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='currency_rates' and policyname='currency_rates_select_all'
  ) then
    create policy currency_rates_select_all on public.currency_rates for select using (true);
  end if;
end $$;

-- Optional write policy for service role (explicit intent; service role bypasses RLS)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='currency_rates' and policyname='currency_rates_write_service'
  ) then
    create policy currency_rates_write_service on public.currency_rates
      for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
  end if;
end $$;
