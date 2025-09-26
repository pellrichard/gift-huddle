
Param(
  [string]$BundleZip = "gift-huddle-complete-bundle-v8.zip",
  [string]$BranchName = "feat/complete-refresh"
)

$ErrorActionPreference = "Stop"

Write-Host "⏳ Applying Gift Huddle refresh (v8)..." -ForegroundColor Cyan

# 1) Sanity checks
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "git not found. Please install Git for Windows."
}

if (-not (Test-Path ".git")) {
  Write-Error "This does not look like a git repo. Run this from your repo root."
}

if (-not (Test-Path $BundleZip)) {
  Write-Error "$BundleZip not found in the current directory. Place the bundle ZIP in the repo root and re-run."
}

# 2) Create/switch branch
try {
  git switch -c $BranchName | Out-Null
} catch {
  git switch $BranchName | Out-Null
}

# 3) Unzip bundle (overwrite existing files)
Write-Host "📦 Unzipping bundle: $BundleZip" -ForegroundColor Yellow
Expand-Archive -Path $BundleZip -DestinationPath . -Force

# 4) Ensure Tailwind v4 PostCSS plugin deps
Write-Host "📦 Installing dev deps: tailwindcss @tailwindcss/postcss" -ForegroundColor Yellow
npm i -D tailwindcss @tailwindcss/postcss

# 5) Ensure .env.local exists
if (-not (Test-Path ".env.local")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env.local"
    Write-Host "📝 Created .env.local from .env.example (fill Supabase keys)." -ForegroundColor Green
  } else {
@"
# Social URLs (optional)
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/profile.php?id=61581098625976
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/gift-huddle

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
"@ | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host "📝 Created .env.local (fill Supabase keys)." -ForegroundColor Green
  }
}

# 6) Ensure tsconfig alias @/* -> src/*
$tsConfigPath = "tsconfig.json"
if (Test-Path $tsConfigPath) {
  Write-Host "🔧 Ensuring @ alias in tsconfig.json" -ForegroundColor Yellow
  $tsJson = Get-Content $tsConfigPath -Raw | ConvertFrom-Json
  if (-not $tsJson.compilerOptions) { $tsJson | Add-Member -MemberType NoteProperty -Name compilerOptions -Value (@{}) }
  if (-not $tsJson.compilerOptions.baseUrl) { $tsJson.compilerOptions.baseUrl = "." }
  if (-not $tsJson.compilerOptions.paths) { $tsJson.compilerOptions | Add-Member -MemberType NoteProperty -Name paths -Value (@{}) }
  if (-not $tsJson.compilerOptions.paths."@/*") {
    $tsJson.compilerOptions.paths | Add-Member -MemberType NoteProperty -Name "@/*" -Value @("src/*")
  }
  $tsJson | ConvertTo-Json -Depth 10 | Out-File $tsConfigPath -Encoding utf8
  Write-Host "✅ tsconfig alias ensured" -ForegroundColor Green
} else {
  Write-Host "🧩 Creating tsconfig.json with @ alias" -ForegroundColor Yellow
@"
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
"@ | Out-File -FilePath $tsConfigPath -Encoding utf8
}

# 7) Remove legacy "postcss" field from package.json if present
$pkgPath = "package.json"
if (Test-Path $pkgPath) {
  $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
  if ($pkg.PSObject.Properties.Name -contains "postcss") {
    Write-Host "🧹 Removing legacy postcss field from package.json" -ForegroundColor Yellow
    $pkg.PSObject.Properties.Remove("postcss")
    $pkg | ConvertTo-Json -Depth 10 | Out-File $pkgPath -Encoding utf8
  }
}

# 8) Stage, commit
Write-Host "🧾 Staging changes" -ForegroundColor Yellow
git add .

Write-Host "✅ Creating commit" -ForegroundColor Green
git commit -m "feat: complete homepage + pink brand + social buttons + Supabase OAuth; Tailwind v4/PostCSS config"

Write-Host ""
Write-Host "🎉 Done. Now push and open a PR:" -ForegroundColor Cyan
Write-Host "   git push origin $BranchName"
