-- 2025-10-08: Safe alignment of profile column names to canonical schema.
do $$
begin
  -- display_name -> full_name
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'display_name'
  ) and not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'full_name'
  ) then
    execute 'alter table public.profiles rename column display_name to full_name';
  end if;

  -- dob_show_year -> show_dob_year
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'dob_show_year'
  ) and not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'show_dob_year'
  ) then
    execute 'alter table public.profiles rename column dob_show_year to show_dob_year';
  end if;
end $$;
