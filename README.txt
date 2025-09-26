# Gift Huddle Legal Pages – App Router + Fallback

**Use ONE approach:**

## A) App Router (recommended, Next.js 13+)
Place files:
- app/privacy/page.tsx
- app/terms/page.tsx

## B) Legacy fallback (if you really want to keep app/pages/)
Place files:
- app/pages/privacy.tsx
- app/pages/terms.tsx

Notes:
- All problematic quotes are HTML-escaped (e.g., &quot;) and we added a file-level ESLint disable for react/no-unescaped-entities.
- Prefer App Router structure and delete the old `app/pages/*` files to avoid duplicates.
