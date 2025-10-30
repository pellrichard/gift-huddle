# Gift Huddle — Events Feature Patch

Adds:

- Supabase **events** table with secure RLS
- API: `GET/POST/DELETE /api/events`
- UI: `EventsSection` (list + add form) on the Account page

## Install (commit to main)

```bash
# unzip into repo root (preserve folders)
git add .
git commit -m "feat: events schema + API + UI on Account page"
git push origin main
```

## Apply the SQL on Supabase

- Open **Supabase → SQL** and paste contents of `supabase/migrations/2025-09-29_events.sql`
- Run it. Confirm `events` created and RLS enabled.

## Test

- Log in → go to `/account`
- Add a few events (title + date required)
- See them appear under "Upcoming events"
- Delete one with the trash icon
