Param(
  [string]$Root = "."
)

$files = Get-ChildItem -Path $Root -Recurse -Include *.ts,*.tsx -File
$changed = @()

foreach ($file in $files) {
  $content = Get-Content -Path $file.FullName -Raw

  if ($content -match "from\s+['""]@/lib/supabase/server['""]") {
    $original = $content

    # Import renames
    $content = $content -replace "\bcreateServerSupabase\b", "createServerComponentClient"
    $content = $content -replace "\bcreateRouteHandlerSupabase\b", "createRouteHandlerClient"
    $content = $content -replace "\bcreateClient\b", "createRouteHandlerClient"

    # Callsite fixes: strip any arguments from these helpers
    $content = $content -replace "\bcreateServerComponentClient\s*\([^)]*\)", "createServerComponentClient()"
    $content = $content -replace "\bcreateRouteHandlerClient\s*\([^)]*\)", "createRouteHandlerClient()"
    $content = $content -replace "\bcreateServerActionClient\s*\([^)]*\)", "createServerActionClient()"

    if ($content -ne $original) {
      Set-Content -Path $file.FullName -Value $content -Encoding UTF8
      $changed += $file.FullName
    }
  }
}

"`nUpdated files:`n" + ($changed -join "`n")
