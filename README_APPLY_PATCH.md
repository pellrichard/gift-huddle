# Gift Huddle — ESLint & TS Fix Patch (Drop-in)

This zip contains **unified diff patches** plus a small helper component. Apply them to clean your build warnings/errors exactly as seen in your latest Vercel log.

## Contents
- `patches/001-*.diff` … `007-*.diff` — targeted changes for each file from your log.
- `src/components/ui/SmartImage.tsx` — optional helper you can start using for images.

## How to apply

### Option A — One shot (recommended)
From the project root (where your `app/` and `src/` folders are):

```bash
git apply --whitespace=fix patches/*.diff
```

> If any hunk fails (e.g., your file has diverged), open the `.diff` and apply the tiny edits manually — they are very small and commented.

### Option B — Manual copy/paste
Each `.diff` shows a tiny change set (import `next/image`, replace `<img>` with `<Image>`, fix hooks deps, remove `any`). Search for the shown lines in your file and update accordingly.

## Notes
- These patches do **not** change behavior — they only address lint & type errors:
  - Swap `<img>` → `<Image>` and add `width`/`height` for Next.js.
  - Fix `react-hooks/exhaustive-deps` with `useCallback` and complete deps.
  - Remove `any` in `ProfileBanner.tsx` by using proper React event types & booleans.
  - Remove an unused import in `AccountPage.tsx`.
- After applying, run:
  ```bash
  npm run lint && npm run build
  ```

## Using SmartImage (optional)
Import from `@/components/ui/SmartImage` and drop it in place of raw `Image` when you want a consistent wrapper.
