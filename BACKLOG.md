### 2025-10-03 – Auth-aware header and homepage redirect

- Header now checks Supabase session on the server and conditionally shows:
  - Logged-in: "My account" and "Log out"
  - Logged-out: "Log in"
- Homepage (`/`) now redirects authenticated users to `/account` using a server-side Supabase check.
- Switched logo references to SVG under `/public/assets/logo.svg` per request.
- Files touched:
  - `src/components/chrome/HeaderBar.tsx`
  - `src/components/chrome/FooterBar.tsx`
  - `app/page.tsx`
