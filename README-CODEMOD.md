# Codemod update (v9)

This update makes the codemod also strip arguments from:

- `createRouteHandlerClient(...)`
- `createServerComponentClient(...)`
- `createServerActionClient(...)`

## Run via PowerShell (Windows 11)

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.	ools\codemod-supabase-helpers.ps1 -Root .
```

## Or run via Node (no ExecutionPolicy changes)

```bash
node tools/codemod-supabase-helpers.js .
```

_Updated 2025-10-02T14:23:18.689832Z_
