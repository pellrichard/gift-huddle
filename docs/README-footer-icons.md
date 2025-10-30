# Footer Social Icons (No extra deps)

Replaces text links with SVG icons for Facebook and LinkedIn using **inline React SVGs** (no library required).

## Files

- `src/components/icons/SocialIcons.tsx` (FacebookIcon, LinkedInIcon)
- `src/components/Footer.tsx` (uses the icons)

## Install

1. Unzip into your repo root (it will create/update `src/components/...` paths).
2. Build or run dev:
   ```bash
   npm run dev
   # or
   npm run build
   ```

## Notes

- Icons are accessible (have `aria-label` and `title`).
- Tailwind classes are used for sizing/hover. Adjust to match your palette/theme if needed.
