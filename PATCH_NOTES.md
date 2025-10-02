Consolidation Patch – Single app/ tree

What changed
- Copied `src/app/api/waitlist/route.ts` to `app/api/waitlist/route.ts` (kept implementation).
- Copied `src/app/favicon.ico` to `app/favicon.ico` (if it existed).
- Added `CLEANUP.txt` with delete instructions for `src/app`.
- Updated `BACKLOG.md` with today's entry.

Why
- Having both `app/` and `src/app/` confused routing. Next.js prefers `/app`, so pages under `src/app` could be ignored or partially applied.
- This consolidation ensures a single, predictable routing tree and stabilizes redirects after OAuth.

How to apply
1) Unzip this patch at the repo root (paths preserved).
2) Follow `CLEANUP.txt` to delete `src/app`.
3) `npm run build` → `npm run dev`.
4) QA:
   - /login while signed out shows OAuth providers.
   - Sign in via Google/Facebook → land on /account.
   - Visit /login while signed in → redirect to /account.
   - Direct-hit /account while signed out → redirect to /login.