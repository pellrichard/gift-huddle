# OAuth Callback Hardening

- `middleware.ts` now matches `/auth/:path*` so host canonicalization (`SITE_HOST`) also applies to the OAuth callback.
- This prevents providers from landing on a non-canonical host where cookies won't later be visible to the app.

Facebook app settings (Developer Console):

- **Valid OAuth Redirect URIs** must include your Supabase project's GoTrue callback:
  `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback`
  (Supabase handles the provider response, then redirects to our `redirectTo` on your site with `?code=`.)

Supabase → Authentication → URL Configuration:

- **Site URL**: `https://www.gift-huddle.com`
- **Redirect URLs**: `https://www.gift-huddle.com/auth/callback`
