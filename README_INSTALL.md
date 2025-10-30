# Gift Huddle — Today's Patch (drop-in)

This patch:

- Adds favicon, apple-touch-icon, and a web app manifest
- Wires icon links into `app/layout.tsx` via a `<head>` block
- Provides optimized logos at `public/images/brand/logo-256.webp` and `logo-512.webp`
- Includes a tiny script to verify key assets exist

## How to install (copy–paste friendly)

1. **Create a new branch**

   ```bash
   git checkout -b chore/icons-manifest-setup
   ```

2. **Copy these files into your repo root**, preserving folder structure:
   - `app/layout.tsx`
   - `public/favicon.ico`
   - `public/apple-touch-icon.png`
   - `public/manifest.webmanifest`
   - `public/images/brand/logo-256.webp`
   - `public/images/brand/logo-512.webp`
   - `scripts/verify-assets.mjs`

3. **Recommended cleanups (delete these if they exist)**
   - `src/components/layout/Navbar.tsx` (old navbar with "Pricing")
   - `src/app/page.tsx` (duplicate home page — `app/page.tsx` is the real one)
   - `assets-bundle/app/how-it-works/page.tsx` (duplicate)
   - `public/hero.jpg` (unused; hero is `/images/characters/hero-female.webp`)

   ```bash
   git rm -f src/components/layout/Navbar.tsx src/app/page.tsx assets-bundle/app/how-it-works/page.tsx public/hero.jpg || true
   ```

4. **(Optional) Add a Next config for image formats**
   Create `next.config.ts`:

   ```ts
   import type { NextConfig } from 'next'
   const nextConfig: NextConfig = {
     images: { formats: ['image/avif', 'image/webp'] },
   }
   export default nextConfig
   ```

5. **Verify assets**

   ```bash
   node scripts/verify-assets.mjs
   ```

6. **Commit & push**

   ```bash
   git add .
   git commit -m "chore: add favicon, manifest, optimized logos; clean duplicates"
   git push -u origin chore/icons-manifest-setup
   ```

7. **Vercel env check (Supabase)**
   - Ensure these are set in **Preview** and **Production**:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

8. **Open the Preview**
   - Check the header logo renders, the hero image appears, and the favicon/app icons load.
   - Validate social previews (optional): create `public/social-share.png` (1200×630) and update `metadata.openGraph.images`/`twitter.images` in `app/layout.tsx`.

## Notes

- Header source of truth: `app/components/Header.tsx`
- Hero image: `public/images/characters/hero-female.webp`
- Brand pink tokens already exist in `app/globals.css` and `styles/button.css`. Use class `btn-accent` or `gh-btn gh-btn--primary` for pink CTAs.
