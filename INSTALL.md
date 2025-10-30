# Gift Huddle — Changes Only (apply to `main`)

This bundle contains:

- `patches/*.diff` — the exact diffs to fix your current ESLint/TS build failures.
- `src/components/ui/SmartImage.tsx` — updated helper (requires `alt`) fixing the `jsx-a11y/alt-text` warning.

## Apply diffs directly on `main`

```bash
git checkout main
git pull

# Copy the `patches/` folder to the repo root, then run:
git apply --whitespace=fix patches/*.diff

# Add the SmartImage helper (ensure folders exist if missing)
mkdir -p src/components/ui
cp src/components/ui/SmartImage.tsx src/components/ui/SmartImage.tsx

git add -A
git commit -m "Lint/TS fixes: next/image, hook deps, no-explicit-any; add SmartImage alt enforcement"
git push

npm run lint
npm run build
```

### If any patch fails (context drift)

- Open the failing `.diff` and manually apply the tiny edit (imports or one-liners).
- Then stage/commit as above.
