# Patch: Add framer-motion

Fixes build error:
`Cannot find module 'framer-motion'`

What changed:
- Added `"framer-motion": "^11.0.0"` to dependencies.
- Bumped package.json version to 0.1.3.

Apply:
1) Replace your package.json with this one (or merge the dependency).
2) Run `npm i`.
3) Redeploy.

Note: You still have ESLint warnings about `<img>` usage in `components/account/AccountPage.tsx`. They are safe to ignore, or replace with `next/image` for best LCP.
