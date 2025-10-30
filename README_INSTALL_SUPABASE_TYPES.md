# Gift Huddle — Patch: Supabase types + API route fixes

This patch adds proper Supabase typings and updates the `profile` and `events` API routes so the Next.js build stops failing with the `never`/overload errors.

## Apply

1. Copy these files into your repo, preserving paths:

- `src/lib/supabase/types.ts`
- `app/api/profile/route.ts`
- `app/api/events/route.ts`

2. Install deps (if not already installed):

```bash
npm i @supabase/supabase-js @supabase/auth-helpers-nextjs
```

3. Ensure env vars are set:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Dev / build:

```bash
npm run dev
# or
npm run build && npm run start
```

## Notes

- The Supabase clients are already created with generics in `src/lib/supabase/server.ts` and `src/lib/supabase/client.ts`.
- The `profiles` table `Insert` type requires `id`, so the route uses `upsert({ id: user.id, ...}, { onConflict: "id" })` to avoid races.
- If you later generate full types, replace `src/lib/supabase/types.ts` with the generated file.
