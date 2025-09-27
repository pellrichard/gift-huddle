# Gift Huddle – Facebook profile ingest pack

This adds:
- `app/auth/callback/route.ts` → Exchanges PKCE `code`, fetches Facebook fields (`id,name,email,birthday`), upserts into `public.profiles`.
- `components/LoginWithFacebook.tsx` → Sign-in button with PKCE and minimal scopes.
- `lib/supabase/*` → Helpers for server/client usage.
- `sql/profiles.sql` → Table + RLS + policies.

## Install deps
npm i @supabase/auth-helpers-nextjs @supabase/supabase-js

## Env (Vercel)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

## Supabase → Auth → URL Configuration
Site URL: https://gift-huddle-tau.vercel.app
Additional Redirect URLs:
  https://gift-huddle-tau.vercel.app/auth/callback
  http://localhost:3000/auth/callback

## Facebook scopes (keep minimal)
- Recommended now: public_profile,email
- Optional if you need birthday reminders: user_birthday

The example login requests: public_profile,email,user_birthday

## Run the SQL
Paste `sql/profiles.sql` into the Supabase SQL editor (or add to migrations) to create the table and policies.

## Mapping stored
- full_name ← FB `name` (or Supabase `user_metadata.full_name`)
- email     ← FB `email` (fallback: Supabase `users.email`)
- avatar_url← FB profile picture URL (via `https://graph.facebook.com/<id>/picture?type=large`)
- birthdate / birth_day / birth_month / hide_birth_year ← parsed from FB `birthday` ("MM/DD[/YYYY]")
- fb_id     ← FB `id`

## Notes
- If users hide their year on Facebook, we store day/month and set `hide_birth_year = true`.
- If you later decide to request gender/likes/friends, extend the Graph API `fields` and add columns/policies as needed (expect App Review).
