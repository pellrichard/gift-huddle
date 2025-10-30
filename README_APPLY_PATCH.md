# Gift Huddle Login Fix – Patch

This patch replaces **app/auth/callback/route.ts** so that:

- Supabase SSR writes cookies via a **writable adapter** (no manual cookie plumbing).
- The callback returns a **200 landing page** with an instant client-side navigate,
  avoiding Set-Cookie loss on 302 redirects.

## Apply

1. Copy the file in this zip to your repo at the same path:
   - `app/auth/callback/route.ts`

2. Commit and deploy on Vercel.

3. In Supabase → Authentication → URL Configuration:
   - Add all redirect URLs you use (production + preview), for example:
     - `https://gift-huddle.com/auth/callback`
     - `https://www.gift-huddle.com/auth/callback`
     - `https://*-gift-huddle.vercel.app/auth/callback` (or your preview pattern)

4. Test the flow:
   - Login with Google/Facebook.
   - On the landing page, you should be redirected to `/account` (or `next=`).
   - In DevTools → Application → Cookies, you should see `sb-…auth-token` and `sb-…refresh-token`.

## Notes

- Cookie attributes are handled by Supabase (`HttpOnly`, `Secure`, `Path=/`, `SameSite=Lax`).
- Do **not** set the `Domain=` attribute unless you need cross-subdomain cookies.
- You can keep your existing `middleware.ts` for now. If problems persist,
  temporarily disable the middleware to reduce moving parts during debugging.
