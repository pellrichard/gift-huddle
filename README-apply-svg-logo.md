# Apply SVG Logo (no background)

This bundle provides a clean SVG of the approved Gift Huddle logo and updates the header to use it.

## Files

- `public/logo.svg` — vector, transparent background
- `src/components/Header.tsx` — points the logo to `/logo.svg`

## Install

Unzip into your repo root and commit.

```bash
git checkout -b chore/logo-svg
git add public/logo.svg src/components/Header.tsx
git commit -m "Brand: apply SVG logo and wire in header"
git push origin chore/logo-svg
```

If you later add a custom brand font, we can convert the wordmark to outlines to ensure pixel-perfect rendering.
