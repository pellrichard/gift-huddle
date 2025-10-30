# Auth Debugging Guide

Server logs:

- `/auth/signin` now logs `[oauth-signin]` with `{ provider, origin, next }` and `[oauth-signin:redirectTo]` with the exact redirect URL sent to the provider.
- `/auth/callback` now logs `[oauth-callback]` with the full URL and `[oauth-callback:params]` with `{ host, pathname, hasCode, codeLen, next }`.

Client check:

- Hit `/api/debug/auth` to see which auth cookies are present for the current host.

Expected on success:

- After OAuth, `/auth/callback?code=...` should appear briefly, then redirect to `/account`.
- `/api/debug/auth` reports `sb-access-token=true` and `sb-refresh-token=true`.
