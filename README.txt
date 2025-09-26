# Gift Huddle – Pink Brand + Auth UI Bundle (v3)

## Fixes for your Vercel build error
- Your project aliases `@/*` → `./src/*`. This bundle places components under **src/components** so `import Header from '@/components/Header'` resolves.
- Tailwind `content` now includes `./src/**/*` to catch those files.

## What’s included
- **Brand**: pink logo + favicon (public/brand)
- **UI**: Header w/ social buttons (src/components), Tailwind tokens, globals
- **Auth**: Supabase client + OAuth buttons (Google, Apple, Facebook)
  - `src/lib/supabaseClient.ts`
  - `src/components/AuthButtons.tsx`
  - `app/sign-in/page.tsx`
  - `app/auth/callback/page.tsx`
- **Docs**: `docs/requirements-signup.md`, `docs/tsconfig-paths.example.json`
- **Config**: `.env.example` (social URLs + Supabase keys)

## Apply
1) Copy bundle into repo root.
2) Ensure your `tsconfig.json` has:
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": { "@/*": ["src/*"] }
     }
   }
3) Fill `.env.local` from `.env.example` with your Supabase URL + anon key.
4) `git add . && git commit -m "chore: brand+auth ui"` and push.
5) In Supabase, enable Google/Apple/Facebook providers and set redirect:
   - `https://<your-domain>/auth/callback`
   - Local dev: `http://localhost:3000/auth/callback`
