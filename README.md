# Gift Huddle – Fix Patch (merge markers + AccountPage path)

This package contains:
- `patches/resolve-merge-and-account-alias.patch` – a unified diff you can apply with `git apply`.
- `scripts/apply-patch.sh` – Bash helper (macOS/Linux/Git Bash).
- `scripts/apply-patch.ps1` – PowerShell helper (Windows).
- `scripts/verify-build.sh` – optional local build check.
- `new-files` – reference copies of the fixed files if you prefer manual replacement.

## What this patch does
1. **Removes merge conflict markers** and replaces `app/page.tsx` with a clean home page.
2. **Fixes the Account page import path** so it resolves on case-sensitive file systems:
   - `app/account/page.tsx` imports `@/components/account/AccountPage`.
3. Adds a **reference** `src/components/account/AccountPage.tsx` skeleton in `new-files/` (in case yours is missing or casing differs). If you already have this component, the patch does **not** overwrite it; use the `git mv` step below to fix casing.

---

## QUICK APPLY (recommended)

From your repo root (`gift-huddle`):

### A) Stash/commit any local work
```bash
git add -A
git commit -m "wip" || true
```

### B) Apply patch
**macOS/Linux/Git Bash**
```bash
bash scripts/apply-patch.sh
```

**Windows PowerShell**
```powershell
./scripts/apply-patch.ps1
```

If `git apply` complains about the `AccountPage` path (common on Windows if casing differs), run the **Case-fix** step below and re-run the apply script.

### C) Verify
```bash
npm ci
npm run build
```

---

## CASE-FIX (only if build still says "Module not found: '@/components/account/AccountPage'")

If your component exists but with different casing (e.g., `accountpage.tsx`, `Accountpage.tsx`, `accountPage.tsx`), rename it using `git mv` so Git records the case change:

```bash
# Example if your current file is accountpage.tsx (change this to match your actual file)
git mv src/components/account/accountpage.tsx src/components/account/tmp.tsx
git mv src/components/account/tmp.tsx src/components/account/AccountPage.tsx

# If the folder casing is wrong too:
git mv src/components/Account src/components/tmp || true
git mv src/components/tmp src/components/account || true
```

Re-run the patch script and build:
```bash
bash scripts/apply-patch.sh   # or ./scripts/apply-patch.ps1
npm run build
```

---

## MERGING BRANCHES (to get your fix to `main`)

Assuming your work is on `fix/ui-shims-accountpage`:

```bash
# Make sure you're up to date
git fetch origin

# Start from the fix branch
git checkout fix/ui-shims-accountpage

# Update it with the latest main (resolve any conflicts locally)
git merge origin/main

# If you see merge markers again, fix files (especially app/page.tsx), then:
git add -A
git commit -m "Resolve merge; clean app/page.tsx; fix AccountPage path"

# Push your branch
git push -u origin fix/ui-shims-accountpage

# Open a PR on GitHub from fix/ui-shims-accountpage -> main
# After review, squash/merge or merge normally.
```

If you prefer fast-forwarding `main` locally (not typical with Vercel CI/CD):
```bash
git checkout main
git pull --ff-only
git merge --no-ff fix/ui-shims-accountpage -m "Merge fix: resolve merge markers and AccountPage path"
git push origin main
```

---

## Manual install (without `git apply`)
Copy files from `new-files/` into your repo at the same relative paths and commit them.

---

## Files affected by this patch
- `app/page.tsx` (replaced)
- `app/account/page.tsx` (normalized import)
- (Reference only) `src/components/account/AccountPage.tsx`

