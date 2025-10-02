### 2025-10-02 – OAuth callback exchange + canonicalization
- Implemented `/auth/callback` exchanging code for session (sets sb cookies).
- Implemented `/auth/signin` server redirect to provider.
- Added `/api/debug/auth` endpoint.
- Canonical host middleware for `/auth/:path*` and `/api/:path*`.
