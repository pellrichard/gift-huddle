# Production Diagnostics

This patch adds:
- `app/api/health` – checks for missing env vars.
- `app/global-error.tsx` – shows the Next.js error digest on screen and allows retry.
- `src/lib/utils/env.ts` – required env list + checker (works with `@` -> `./src` alias).

## How to use

1. **Hit the health endpoint**
   - Local: http://localhost:3000/api/health
   - Prod: https://www.gift-huddle.com/api/health

2. **If status is `degraded`**, add the missing env vars in Vercel → Project → Settings → Environment Variables.

3. **If you still see the digest error in prod**, the app is still trying to set cookies
   outside a Server Action or Route Handler. Move any cookie writes (Supabase refresh)
   into an Action or `/app/api/.../route.ts` handler.

_Generated 2025-10-02T13:54:10.641520Z_
