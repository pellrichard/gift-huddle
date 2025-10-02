### 2025-10-02
- Completed: 
  - Fixed Supabase client cookie handling (RSC reads cookies, Actions/Routes can write).
  - Removed all `any` usage and silenced ESLint issues across server helpers.
  - Added dynamic OAuth provider support with env flags; fallback defaults to Google/Facebook/GitHub.
  - Branded OAuth buttons with logos and consistent width (73rem).
  - Implemented robust logout with cookie clearing (`sb-*` tokens).
  - Added `/auth/signin` route to handle OAuth securely on the server.
  - Fixed `/auth/callback` to exchange codes correctly and redirect.
  - Added debug endpoints (`/api/debug/session`, `/api/debug/cookies`) for troubleshooting auth state.
- Outstanding:
  - Verify `/account` still renders correctly after login; ensure no loops back to `/login`.
  - Ensure Vercel env vars (`NEXT_PUBLIC_AUTH_*`) are set for the intended providers in production.
  - Confirm Supabase dashboard providers (Google, Facebook, GitHub, etc.) are enabled with correct Redirect URLs.
  - Optional: Add additional provider branding icons (GitHub, LinkedIn, etc.) for polish.
- Notes:
  - Login page now adapts provider list dynamically based on env flags, with defaults if none set.
  - ESLint guard prevents use of legacy Supabase helpers (`createClient`, `createServerSupabase`, etc.).


### 2025-10-02 – Remove unsupported `flowType`
- Reverted `options.flowType` to fix type error in build.
