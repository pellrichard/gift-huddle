# All-in-one Patch – OAuth upsert, fx_rates currency, UI labels & TS prop fixes (2025-10-21)

- **OAuth Callback** (`/auth/callback`): Upserts `profiles` and `profiles_public` with full_name, email, avatar_url; defaults `notify_mobile`/`notify_email` to **true**; sets `preferred_currency` from **Accept-Language** normalized against `fx_rates`; redirects to **/onboarding** if `dob` missing, else to `next` (default `/account`).
- **Server Actions** (`src/actions/profile.ts`):
  - `upsertProfileFromAuth`, `getProfileForEdit`, `saveProfile` (currency validated via `fx_rates`), back-compat `ensureProfileForRequest`/`bootstrapProfileFromAuth`.
  - Currency helpers: `listCurrenciesForUiDetailed` (labels) + `listCurrenciesForUi` (codes).
- **Locale Mapping**: Robust Accept-Language → currency (EU → EUR, US → USD, GB → GBP; fallback GBP).
- **Account Page**: Fetches currency options server-side and passes to dashboard.
- **Dashboard & Modal**: Add optional `currencyOptions`/`currencyOptionsDetailed` props; modal renders option **labels** from server when available; otherwise falls back to codes.
- **ESLint**: Avoids unused catch vars in the callback route to keep lint clean.

Files changed:

- `src/lib/locale.ts`
- `src/actions/profile.ts`
- `app/auth/callback/route.ts`
- `app/account/page.tsx`
- `src/components/account/AccountDashboard.tsx`
- `src/components/account/EditProfileModal.tsx`
