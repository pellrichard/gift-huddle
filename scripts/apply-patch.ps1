Param()
Write-Host "== Gift Huddle patch: resolve-merge-and-account-alias =="
# Ensure we are in a git repo
git rev-parse --is-inside-work-tree 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Error "Not a git repo. Run inside your repo."
  exit 1
}
# Pre-patch snapshot
git add -A
git commit -m "chore: pre-patch snapshot" 2>$null | Out-Null
# Apply patch
git apply -p0 patches/resolve-merge-and-account-alias.patch
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "Patch applied."
Write-Host "If you still see module-not-found for AccountPage, run the CASE-FIX steps in README."
