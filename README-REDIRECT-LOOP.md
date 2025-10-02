# Redirect loop guard + debugging

**Symptoms**: "/login" ↔ "/account" infinite redirects.

**Fixes in this patch**
- `/login` no longer auto-redirects when a session is present. It renders a 'Continue to your account' link instead.
- Added `/api/debug/cookies` to list cookie names the server can see.
- Added `app/account/layout.tsx` with `dynamic="force-dynamic"` and `revalidate=0` to ensure the account tree doesn't get cached by a parent.

**Triage steps**
1) After OAuth, open `/api/debug/session` — confirm `user` exists server-side.
2) Open `/api/debug/cookies` — confirm `sb-<ref>-auth-token` (and refresh token) appear.
3) Visit `/login` — if signed in, click 'Continue to your account'; `/account` should render.
4) If `/account` still redirects, a higher layout may be static. We can mark it as dynamic similarly.

_Updated 2025-10-02T18:32:48.916508Z_
