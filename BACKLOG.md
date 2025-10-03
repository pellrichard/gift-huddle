### 2025-10-04 – Fix homepage visibility & logout redirect

- **Homepage**: `/` now redirects to `/account` only when authenticated; otherwise it renders a visible public landing
  (previously returned `null`, causing a blank page).
- **Logout (ERR_CONNECTION_REFUSED)**: `/logout` POST handler now derives redirect origin from the incoming request
  instead of using `NEXT_PUBLIC_SITE_URL`/localhost. This prevents production from redirecting to `http://localhost:3000`.
- Added `/api/debug/origin` to inspect request origins during deployments.
