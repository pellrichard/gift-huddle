# Auth Callback Fix v3 — Reliable cookies on redirect

This version binds Supabase's cookie writes to a temporary Response and copies
the cookies onto the final redirect Response. This avoids the common issue
where `Set-Cookie` can be lost when returning a new redirect response.

Replace `app/auth/callback/route.ts` with this file and redeploy.

Notes:

- Still prevents open redirects (only relative `next` is allowed).
- Uses strict typing (no `any`).
- If cookies are still absent, double-check Supabase Site URL and domain (`www.gift-huddle.com`).
