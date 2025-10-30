# Removed unsupported `flowType` option

Your current `@supabase/supabase-js` typings do not include `options.flowType` on `signInWithOAuth`.
I removed that property so the build passes.

To ensure authorization code flow (vs implicit), confirm in **Supabase Dashboard → Authentication → Providers**:

- Facebook/Google: standard web OAuth (Supabase handles PKCE/code under the hood). No extra app code needed.
- **URL Configuration** remains:
  - Site URL: `https://www.gift-huddle.com`
  - Redirect URLs: `https://www.gift-huddle.com/auth/callback`

We’ve already:

- Canonicalized host via `SITE_HOST` (middleware covers `/auth/:path*`).
- Logged callback params; you’ll see `missing_code` if the provider doesn’t return `?code=`.
- Ensured `redirectTo` always targets the canonical host.

If callbacks still arrive without `code`, double-check the **Facebook Developer Console** “Valid OAuth Redirect URIs” includes your Supabase GoTrue URL:
`https://<PROJECT-REF>.supabase.co/auth/v1/callback`
