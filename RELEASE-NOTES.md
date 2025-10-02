# Release Notes – 2025-10-02

## Completed
- **Supabase Client**: Split into RSC/Actions/Route variants, typed with `Database`, no illegal cookie writes.
- **Lint Fixes**: Removed `any`, replaced with safe type guards; added ESLint rules to forbid legacy helper imports.
- **Auth Flow**:
  - Implemented `/auth/signin` and `/auth/callback` with secure redirects.
  - Logout route clears all Supabase cookies robustly.
  - Added `/api/debug/session` and `/api/debug/cookies` for diagnostics.
- **Login UI**:
  - Branded buttons for Google, Apple, Facebook (with logos/colors).
  - Dynamic provider list based on env flags (or defaults).
  - Layout width aligned to 73rem.

## Outstanding
- [ ] Verify `/account` doesn’t loop back to `/login` after successful OAuth.
- [ ] Configure `NEXT_PUBLIC_AUTH_*` env vars in Vercel for all desired providers.
- [ ] Confirm Supabase dashboard provider configs and Redirect URLs.
- [ ] Add polish: missing icons for some providers.

---

## Next Steps
1. Deploy with correct env vars and provider configs.
2. Validate login/logout flows in production (`/login`, `/account`, `/auth/callback`).
3. Use `/api/debug/*` endpoints to confirm server sees cookies + sessions.
