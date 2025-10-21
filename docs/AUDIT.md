# Gift Huddle – Full Repository Audit

_Date: 2025-10-21_

## Overview
- **Repo root:** `/mnt/data/repo/gift-huddle-main`
- **Files:** 304 total (text: 278, binary: 26)
- **Approx. lines of code:** 17735

**Top extensions**
|ext|count|
|---|---|
|.md|81|
|.tsx|58|
|.ts|51|
|.png|16|
|.sql|14|
|.json|12|
||10|
|.diff|7|
|.txt|6|
|.ps1|6|
|.css|6|
|.webp|6|
|.svg|6|
|.patch|5|
|.js|5|

### package.json
- **name:** `gift-huddle`
- **version:** `0.1.2`

**Scripts**
|script|command|
|---|---|
|dev|next dev|
|build|next build --turbopack|
|start|next start|
|lint|next lint|

**Dependencies (first 20)**
|package|version|
|---|---|
|@radix-ui/react-avatar|^1.1.10|
|@radix-ui/react-slot|^1.2.3|
|@supabase/ssr|^0.7.0|
|@supabase/supabase-js|^2.58.0|
|@vercel/analytics|^1.5.0|
|@vercel/speed-insights|^1.2.0|
|framer-motion|^12.23.22|
|lucide-react|^0.544.0|
|next|15.5.4|
|react|^18.3.1|
|react-dom|^18.3.1|
|zod|^3.23.8|

**DevDependencies (first 20)**
|package|version|
|---|---|
|@eslint/js|^9.37.0|
|@next/eslint-plugin-next|^15.5.4|
|@tailwindcss/postcss|^4.0.0|
|@types/node|^22.7.4|
|@types/react|^18.3.5|
|@types/react-dom|^18.3.0|
|autoprefixer|^10.4.20|
|eslint|^9.12.0|
|eslint-config-next|15.5.4|
|globals|^16.4.0|
|postcss|^8.4.47|
|typescript|^5.6.3|
|typescript-eslint|^8.45.0|

### Structure (shallow)

**/app**

```
(auth)/
_debug/
account/
api/
assets-bundle/
auth/
components/
contact/
features/
how-it-works/
login/
logout/
onboarding/
privacy/
sign-in/
terms/
README.txt
app.globals.css
error.tsx
favicon.ico
fonts.ts
global-error.tsx
globals.css
globals.css.add-this-line.css
head.tsx
layout.tsx
page.tsx
page.tsx.example
postcss.config.js
tailwind.config.ts
  login/
    LoginButtons.tsx
  auth/
    page.tsx
  ConnectProviders.tsx
  actions.ts
  layout.tsx
  page.tsx
  _debug/
  auth/
  debug/
  events/
  fx/
  health/
  profile/
  recommendations/
  waitlist/
    auth/
    refresh/
    auth/
    cookies/
    origin/
    ping/
    session/
    route.ts
    update/
    route.ts
    route.ts
    route.ts
    route.ts
  [...path]/
    route.ts
  callback/
  signin/
    route.ts
    route.ts
  CodeCleanup.tsx
  Footer.tsx
  Header.tsx
  Hero.tsx
  Recommendations.tsx
  ReminderSetting.tsx
  ToastProvider.tsx
  page.tsx
  page.tsx
  page.tsx
  page.tsx
  route.ts
  update/
  page.tsx
    route.ts
  page.tsx
  page.tsx
  page.tsx
```

**/src**

```
actions/
components/
lib/
supabase/
types/
  profile.ts
  account/
  analytics/
  chrome/
  icons/
  layout/
  ui/
  AuthButtons.tsx
  Features.tsx
  Footer.tsx
  Header.tsx
  Hero.tsx
  LoginProviderButtons.tsx
  SocialButtons.tsx
    AccountClient.tsx
    AccountDashboard.tsx
    AccountPage.tsx
    EditProfileModal.tsx
    EventsSection.tsx
    ProfileBanner.tsx
    ProfileForm.tsx
    ProfileSummary.tsx
    Plausible.tsx
    FooterBar.tsx
    HeaderBar.tsx
    SocialIcons.tsx
    Navbar.tsx
    GHButton.tsx
    SmartImage.tsx
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    input.tsx
    modal.tsx
  auth/
  fx/
  logging/
  supabase/
  types/
  utils/
  affiliates.ts
  error-id.ts
  recommendations.sample.json
  supabaseClient.ts
  utils.ts
    cookies.ts
    providers.ts
    conversions.ts
    currencies.ts
    server.ts
    client.ts
    server.ts
    types.ts
    db.ts
    env.ts
  types.ts
  db.types.ts
```

**/lib**

```
supabase/
utils/
affiliates.ts
recommendations.sample.json
  browser.ts
  server.ts
  env.ts
```

**/public**

```
images/
file.svg
globe.svg
manifest.webmanifest
robots.txt
site.webmanifest
sitemap.xml
vercel.svg
window.svg
  characters/
  items/
  suggest/
    group-gifting.png
    group-gifting.webp
    hero-female.png
    hero-female.webp
    hero-male.png
    hero-male.webp
    bose.png
    lego.png
    photobook.png
    thermo.png
    whisky.png
```

### TypeScript Config
- `strict`: `True`
- `skipLibCheck`: `True`
- `target`: `ES2021`
- `module`: `ESNext`
- `jsx`: `preserve`

## Findings

### 1. [LOW] TypeScript 'any' usage
- **File:** `supabase/functions/fx_updater/index.ts:54`
- **Why:** May violate @typescript-eslint/no-explicit-any.
- **Fix:** Replace with specific type or unknown.

### 2. [LOW] Empty block statement detected
- **File:** `supabase/functions/fx_updater/index.ts:108`
- **Why:** ESLint no-empty likely triggers here.
- **Fix:** Add a comment or remove the block.

## Auth & Routing
Detected auth-related routes/pages:
- `app/auth/callback/route.ts`
- `app/login/page.tsx`
- `app/account/page.tsx`

**Supabase-related files (heuristic):**
- `README-PKCE.md`
- `README-REMOVE-FLOWTYPE.md`
- `README_CLIENT_PATCH.md`
- `README_COMBO_PATCH.md`
- `README_FOR_TEAM.md`
- `README_INSTALL_PATCH.md`
- `README_INSTALL_SUPABASE_TYPES.md`
- `README_MIDDLEWARE_PATCH.md`
- `README_SERVER_COMPAT_PATCH.md`
- `README_SERVER_PATCH.md`
- `end-of-day-auth-pr.md`
- `lib__supabase__server.ts`
- `package-lock.json`
- `package.json`
- `app/account/ConnectProviders.tsx`
- `app/api/debug/auth/route.ts`
- `app/api/waitlist/route.ts`
- `app/auth/callback/route.ts`
- `app/auth/signin/route.ts`
- `docs/INSTALL.md`
- `lib/supabase/browser.ts`
- `src/components/LoginProviderButtons.tsx`
- `src/components/account/EventsSection.tsx`
- `src/lib/supabaseClient.ts`
- `src/lib/auth/providers.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `supabase/functions/fx_updater/index.ts`

## Assets (logos/favicons)
- `app/favicon.ico`
- `assets-bundle/ico/favicon.ico`
- `assets-bundle/svg/Gift-Huddle.svg`

## TODO / FIXME Mentions (sample)
|file|tag|
|---|---|
|AUDIT.md|TODO|
|AUDIT.md|FIXME|
|src/components/account/ProfileBanner.tsx|TODO|

## Action Plan
1) Remove control characters flagged above.
2) Ensure ESLint with `next/core-web-vitals` rules is configured.
3) Consolidate duplicate `next/navigation` imports per file.
4) Remove or comment empty blocks to satisfy `no-empty`.
5) Replace `any` with specific types where possible.
6) Verify Supabase SSR cookie adapter & OAuth routes align with current Next.js 15 App Router.
7) Run `npm run build` and address remaining TS/ESLint diagnostics by line.