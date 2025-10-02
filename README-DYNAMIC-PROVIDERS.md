# Dynamic OAuth providers (show only if enabled)

**How it works**
- Add env flags for the providers you want to show (1/true/on/yes):
  - `NEXT_PUBLIC_AUTH_GOOGLE=1`
  - `NEXT_PUBLIC_AUTH_APPLE=1`
  - `NEXT_PUBLIC_AUTH_FACEBOOK=1`
  - `NEXT_PUBLIC_AUTH_GITHUB=1`
  - `NEXT_PUBLIC_AUTH_GITLAB=1`
  - `NEXT_PUBLIC_AUTH_BITBUCKET=1`
  - `NEXT_PUBLIC_AUTH_DISCORD=1`
  - `NEXT_PUBLIC_AUTH_TWITCH=1`
  - `NEXT_PUBLIC_AUTH_TWITTER=1`
  - `NEXT_PUBLIC_AUTH_SLACK=1`
  - `NEXT_PUBLIC_AUTH_AZURE=1`
  - `NEXT_PUBLIC_AUTH_LINKEDIN=1`

**Notes**
- `/auth/signin` only accepts providers that are enabled via these flags, preventing accidental 400s.
- You must still enable the provider in **Supabase → Auth → Providers** and ensure the **Redirect URLs** include `/auth/callback` on your domain.

_Updated 2025-10-02T18:57:11.838871Z_
