# Patch: Move AccountPage to `src/components`

This fixes the Vercel build error by matching your `@` alias (which points to `./src/*`).

## Apply
```bash
# from repo root
git fetch origin
git checkout -b chore/move-accountpage-into-src
git apply /path/to/move-to-src.patch
git add -A
git commit -m "chore(account): move AccountPage into src/components to match @ alias"
git push -u origin chore/move-accountpage-into-src
```
Then open a PR from `chore/move-accountpage-into-src` → `feat/complete-refresh`.

If `git apply` complains, you can do it manually:
```bash
mkdir -p src/components/account
git mv components/account/AccountPage.tsx src/components/account/AccountPage.tsx
git commit -m "chore(account): move AccountPage into src/components to match @ alias"
git push -u origin chore/move-accountpage-into-src
```
