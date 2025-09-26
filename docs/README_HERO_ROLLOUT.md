# Rollout: Homepage Hero Image

This patch adds a new hero illustration PNG and updates the homepage to display it.

## Files
- `public/img/hero-wishlist.png` — new transparent PNG hero
- `src/components/Hero.tsx` — hero section with copy and CTA
- `app/page.tsx` — uses the Hero component

## How to apply
1. Merge these files into your repo root.
2. Ensure Tailwind is available (classes used are standard).
3. Deploy to Vercel.

If your project keeps `components/` outside of `src/`, move `src/components/Hero.tsx` accordingly and update the import in `app/page.tsx`.
