### 2025-10-03 – Add error boundaries & structured logging

- Added `app/error.tsx` (segment error boundary) and `app/global-error.tsx` (global error boundary) to replace the generic
  “Something went wrong” with a reset button and to surface the digest code.
- Both boundaries log structured details to server logs so we can trace the exact stack on Vercel.
- Added `src/lib/logging/server.ts` helper for consistent server error logging across the app.
- Added `GET /api/debug/ping` endpoint to quickly verify runtime health.
