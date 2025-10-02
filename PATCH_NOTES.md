# Patch: 0.1.3-patch-login-redirect

## What's in this patch
- New **/login** route (server component) that:
  - If a valid Supabase session exists → redirects to `?next=` (if provided) or `/account`.
  - If no session → renders provider buttons driven by environment flags (via `src/lib/auth/providers.ts`).

- New **LoginProviderButtons** client component that includes the `next` param in the OAuth `redirectTo` back to `/auth/callback`, preventing the post-auth "already signed in" banner + stuck-on-login.

No existing files were modified other than **BACKLOG.md**. You can drop this zip into repo root and overwrite.

## Apply
Unzip into the repository root (it preserves paths):
```
unzip -o gift-huddle-patch.zip -d .
```

## Env
Set provider flags to show buttons:
```
NEXT_PUBLIC_AUTH_GOOGLE=1
NEXT_PUBLIC_AUTH_FACEBOOK=1
NEXT_PUBLIC_AUTH_APPLE=0
# ...others as needed
```

Existing variables still required:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Navigation
Header already links to `/login`. If you still link to `/sign-in` anywhere, change those links to `/login`.

## QA checklist
- Go to `/login` while signed out → see provider list.
- Click Google/Facebook → complete OAuth → land on `/account` (or the `next` target).
- Visit `/login` while signed in → immediate redirect to `/account`.
- Visit `/auth/callback?code=...&next=/account` → you are redirected to `/account` after session set.
- From home page while signed in → you are redirected to `/account` (existing behavior).

