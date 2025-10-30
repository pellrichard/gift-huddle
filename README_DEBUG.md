# Gift Huddle – Auth Debug

## What to capture

1. After you log in, open **/api/\_debug/auth** in the same tab and copy the JSON.
2. Visit **/\_debug/auth** and copy both the Client cookies and Server-side sections.
3. Collect server logs around the login time:
   - On Vercel: `vercel logs <deployment-url> --since 10m`
   - Look for `[MW]` and `[CB]` lines from middleware and auth callback.

## Expected cookies

- `sb-access-token`, `sb-refresh-token` (Supabase)
- Helper: `gh_authed=1`

## Common issues

- Domain mismatch between `NEXT_PUBLIC_APP_URL`, Supabase redirect URLs, and your actual domain.
- SameSite/Secure misconfig for cookies.
