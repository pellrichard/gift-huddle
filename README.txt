# Supabase OAuth Callback (Next.js App Router)

This pack fixes the issue where the app returns from Facebook but the user isn't created.
It uses the PKCE (code) flow and processes the `code` on a server route to set auth cookies.

Files:
- app/auth/callback/route.ts
- components/LoginButtons.tsx
- lib/supabase/client.ts
- lib/supabase/server.ts

Steps:
1) Set env vars on Vercel:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...

2) Supabase Dashboard → Auth → URL Configuration:
   Site URL: https://gift-huddle-tau.vercel.app
   Additional Redirect URLs:
     https://gift-huddle-tau.vercel.app/auth/callback
     http://localhost:3000/auth/callback

3) Use the LoginButtons component or ensure your sign-in call includes:
   redirectTo: `${location.origin}/auth/callback`
   queryParams.flowType: "pkce"

4) Deploy. On return, /auth/callback exchanges the code and redirects to /account (changeable via ?next=).
