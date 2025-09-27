#!/usr/bin/env bash
set -euo pipefail
echo "== Gift Huddle patch: resolve-merge-and-account-alias =="
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Not a git repo. Run inside your repo."; exit 1; }
# Ensure clean-ish
git add -A
git commit -m "chore: pre-patch snapshot" || true
# Apply
git apply -p0 patches/resolve-merge-and-account-alias.patch
echo "Patch applied."
echo "If you still see module-not-found for AccountPage, run the CASE-FIX steps in README."
