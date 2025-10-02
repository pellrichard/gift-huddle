# Codemod: Supabase helper migration

This patch contains a **PowerShell codemod** that replaces legacy helper names with the explicit, safe factories we added.

## What it does

- In any file that imports from `@/lib/supabase/server`, it will:
  - Replace imports:
    - `createServerSupabase` → `createServerComponentClient`
    - `createRouteHandlerSupabase` → `createRouteHandlerClient`
    - `createClient` → `createRouteHandlerClient`
  - Update call sites in the same file and drop legacy `(req, res)` arguments if present.

> It **does not** touch files that don't import from `@/lib/supabase/server`, so it will not interfere with `@supabase/supabase-js` imports.

## How to run (Windows 11 / PowerShell)

From the repo root:

```powershell
# 1) Extract this patch over your repo
Expand-Archive -Path .\gift-huddle-patch.zip -DestinationPath . -Force

# 2) Run the codemod (dry-run not needed; it is targeted)
.	ools\codemod-supabase-helpers.ps1 -Root .

# 3) Build
npm run build
```

## Added SEO basics
- `public/robots.txt`
- `public/sitemap.xml` (basic, update as needed)

## Rollback
Use git to revert any file you don't like, or restore from a branch/commit.

_Updated 2025-10-02T14:18:27.171029Z_
