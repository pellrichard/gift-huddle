# Restore OAuth buttons on /login

This patch adds:
- `app/auth/signin/route.ts` — starts OAuth on the **server**, then redirects to provider.
- `app/login/page.tsx` — renders Google/Apple buttons that link to `/auth/signin?provider=...&next=...`.

**Notes**
- The sign-in route sets `redirectTo` to `/auth/callback?next=...` so you land back where you intended.
- If you deploy with a custom domain, set `NEXT_PUBLIC_SITE_URL` (e.g., `https://www.gift-huddle.com`) so the login page builds absolute links.

**Validate**
1) Visit `/login` — you should see Google/Apple buttons.
2) Click Google → consent → returned to `/account` (or your `next` value).
3) Header should show account state; `/api/debug/session` should show a session after login.

_Updated 2025-10-02T18:04:33.727861Z_
