# Fix: Place aliased components under `src/`

Your project alias `@/*` maps to `./src/*`, so imports like
- `@/components/Footer`
- `@/components/ui/GHButton`

must resolve to files under `src/components/...`

## What this provides
- `src/components/Footer.tsx`
- `src/components/ui/GHButton.tsx`

## Install
1. Unzip into your repo root (it will create/overwrite `src/components/...` files).
2. (Optional) Remove duplicate files in `components/` (without `src/`) to avoid confusion.
3. Re-run build:
```bash
npm run build
```
Everything should now resolve with the `@/...` imports.
