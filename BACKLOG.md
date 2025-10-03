### 2025-10-03 – ESLint cleanup for error boundaries & logging

- Removed `any` casts in `app/error.tsx` and `app/global-error.tsx`; added a `RouteError` type.
- Removed unused eslint-disable comments; kept `console.error` (rule not enforced here).
- Kept friendly error UI with digest display and reset button.
- Central logging helper no longer disables any lint rules.
