# OAuth Cookies Troubleshooting (Supabase + Next.js)

If you land back on /login with **no cookies**:

- Your OAuth callback is likely missing the `code` parameter.

Fix checklist (Supabase Dashboard → Authentication → URL Configuration):

1. **Site URL**: set to your canonical host (e.g., `https://www.gift-huddle.com`).
2. **Redirect URLs**: include `https://www.gift-huddle.com/auth/callback`.
3. Save. Re-run the OAuth flow.

App environment:

- `SITE_HOST=www.gift-huddle.com` (ensures we always use this host for the `redirectTo` origin)
- `AUTH_COOKIE_DOMAIN=.gift-huddle.com` (optional; if you ever touched both apex and www)

What we changed:

- `/auth/signin` now builds the `redirectTo` using `SITE_HOST` (falls back to the request origin).
- `/auth/callback` fails fast to `/login?error=missing_code` when the provider returned without a code.
