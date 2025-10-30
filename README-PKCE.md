# PKCE OAuth Flow Enabled

- Updated `/auth/signin` to request **PKCE** flow: `flowType: 'pkce'`.
- PKCE guarantees the provider round-trip returns to your app with `?code=...` so our `/auth/callback` can exchange it for server cookies.
- This aligns with `@supabase/ssr` and Next.js Route Handlers.

If you previously saw `/auth/callback` without `code`, retry now.
You should see in logs: `[oauth-callback:params] ... hasCode: true` and the response header `X-OAuth-Debug: has_code` in HAR.
