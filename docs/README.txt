# Gift Huddle – Complete Bundle (v8)

## What's included
- Pink brand assets (`public/brand`), hero illustration
- Homepage components (`src/components`) + routed pages (`app/`)
- Supabase OAuth UI and callback
- Tailwind v4 wiring (`app/globals.css`, `tailwind.config.ts`, `postcss.config.js`)
- Docs: signup requirements + tsconfig paths example
- `.env.example` for social links + Supabase keys

## Requirements
- Next.js 15.x
- Tailwind CSS v4: `npm i -D tailwindcss @tailwindcss/postcss`

## Apply
1) Copy these files into the repo root.
2) Ensure `tsconfig.json` has:
   ```json
   { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }
   ```
3) Create `.env.local` from `.env.example` and fill SUPABASE keys.
4) Commit and push.

## Vercel OAuth Redirects
- `https://<your-domain>/auth/callback`
- `http://localhost:3000/auth/callback` (dev)
