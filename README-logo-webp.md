# Transparent WebP Logo

This patch replaces the header logo with a **trimmed, transparent WebP** version of the approved logo.

## Files
- `public/images/brand/logo.webp` — high quality, trimmed, no background
- `src/components/Header.tsx` — updated to use `/images/brand/logo.webp`

## Install
Unzip into your repo root and commit:

```bash
git checkout -b chore/logo-webp
git add public/images/brand/logo.webp src/components/Header.tsx
git commit -m "Brand: apply transparent WebP logo in header"
git push origin chore/logo-webp
```

The header will now show the exact logo (trimmed, transparent, no dead space) via Next.js <Image />.
