Param(
  [string]$Root = "."
)

# Find all TS/TSX files under the root
$files = Get-ChildItem -Path $Root -Recurse -Include *.ts,*.tsx -File

$changed = @()

foreach ($file in $files) {
  $content = Get-Content -Path $file.FullName -Raw

  # Only touch files that import from "@/lib/supabase/server"
  if ($content -match "from\s+['""]@/lib/supabase/server['""]") {

    $original = $content

    # --- Update import specifier names ---
    # Replace in import lists
    $content = $content -replace "\bcreateServerSupabase\b", "createServerComponentClient"
    $content = $content -replace "\bcreateRouteHandlerSupabase\b", "createRouteHandlerClient"
    $content = $content -replace "\bcreateClient\b", "createRouteHandlerClient"

    # --- Update call sites (same file only) ---
    $content = $content -replace "\bcreateServerComponentClient\s*\(\s*[^)]*\)", "createServerComponentClient()"
    $content = $content -replace "\bcreateServerSupabase\s*\(", "createServerComponentClient("
    $content = $content -replace "\bcreateRouteHandlerSupabase\s*\(", "createRouteHandlerClient("
    $content = $content -replace "\bcreateClient\s*\(", "createRouteHandlerClient("

    if ($content -ne $original) {
      Set-Content -Path $file.FullName -Value $content -Encoding UTF8
      $changed += $file.FullName
    }
  }
}

"`nUpdated files:`n" + ($changed -join "`n")
