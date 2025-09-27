# Callback route fix

- Delete `app/auth/callback/page.tsx` if it exists.
- Keep **only** `app/auth/callback/route.ts` (this file).

This avoids the `useSearchParams()` Suspense requirement and prerender errors on `/auth/callback`.
