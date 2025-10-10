# Profile Bootstrap Kit

This adds a small client-side component that creates/updates the `profiles` row
using the **browser Supabase session** (localStorage). It removes the "blank user"
state even if your SSR cookies are being stripped by a proxy.

## Files in this kit
- `src/components/ProfileBootstrap.tsx` — the client component
- `app/api/debug/set-cookie/route.ts` — sets `gh-test=1` cookie for infra check
- `app/api/debug/echo-cookies/route.ts` — echoes request cookies
- `app/api/debug/health/route.ts` — shows what SSR sees for the current user

## Install
1. Unzip this at your repo root.
2. Ensure env vars exist (browser side):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Build: `npm run build`

## Wire it into the Account page
In `app/account/page.tsx` (App Router):

```tsx
import dynamic from "next/dynamic";
const ProfileBootstrap = dynamic(() => import("@/components/ProfileBootstrap"), { ssr: false });

export default async function AccountPage() {
  // ...your existing SSR code (may still see user: null until cookies work)
  return (
    <>
      <ProfileBootstrap />
      {/* your existing account UI */}
    </>
  );
}
```

If your file is `app/account/page.tsx` under a different path, import accordingly.

## Test — Infra cookies (2 minutes)
1. Visit `/api/debug/set-cookie` in the same tab.
   - In DevTools → Network → Response Headers, you should see `Set-Cookie: gh-test=1`.
2. Visit `/api/debug/echo-cookies`.
   - The JSON should show `"cookieHeader": "...gh-test=1..."`.

- If **gh-test is missing**, your host/proxy is stripping cookies from responses. Bypass CDN/proxy for `/auth/*` and `/api/auth/*` (and ideally `/api/debug/*`), don’t cache, and don’t rewrite `Set-Cookie`.
- If **gh-test is present**, cookie pass-through is OK.

## Test — Login & profile creation
1. Sign out, then log in.
2. Land on `/account`. The `<ProfileBootstrap />` runs in the browser and upserts `public.profiles` using the client session.
3. Confirm in Supabase Table Editor → `public.profiles` that a row exists for your `auth.users.id` with `full_name/email/avatar_url` populated.
4. (Optional) Hit `/api/debug/health`. If `user` is still null, SSR cookies are still blocked, but the profile has been created so the page won’t be blank.

## Notes
- This is a pragmatic workaround. Once infra allows SSR cookies, your server actions/pages will also see the session.
- RLS: you must have an INSERT policy like `WITH CHECK (auth.uid() = id)` on `public.profiles` (your schema already includes this).
- If you use a proxy/CDN (Cloudflare, etc.), bypass/cache rules for `/auth/*` and `/api/auth/*` are recommended regardless.
