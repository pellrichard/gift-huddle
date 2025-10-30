# Gift Huddle Changeset — 2025-09-27

This bundle implements the agreed decisions:

- Facebook scopes minimal (email + public_profile)
- Curated recommendations (JSON) to start
- Price monitoring stub
- Link-only public lists
- Brand CTA pink via CSS token
- Plausible analytics

## Apply

1. Unzip this folder into your repo root. Merge/adjust paths if your structure differs.
2. Import `styles/theme.css` once (e.g., in `app/globals.css`).
3. Wire `Header`/`Footer`/`Hero` components into your layout/home.
4. Add Plausible script (see `docs_plausible_snippet.txt`).
5. Run the SQL in `sql/2025-09-27_min_scopes_and_profile.sql` on Supabase.
6. Set env vars on Vercel (Supabase keys, Plausible domain as needed).
7. Replace affiliate IDs in `lib/affiliates.ts`.
8. (Optional) Swap `/public/hero-placeholder.svg` for your real image at `/public/hero.jpg` and update `Hero.tsx`.

## Notes

- Header nav: removed Pricing; Get started → Login in header only.
- CTA button uses `var(--brand-pink)`.
- `/how-it-works`, `/features`, `/privacy` pages included.
- Recommendations available at `/api/recommendations` (sample data).
