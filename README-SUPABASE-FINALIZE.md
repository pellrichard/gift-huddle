# Finalize Supabase client API (no shims) + ESLint guard + types scaffold

This patch:

- **Removes legacy exports** from `lib/src/lib/supabase/server.ts` so only the final API remains:
  - `createServerComponentClient` (RSC — read-only cookies)
  - `createServerActionClient` (Server Actions — read/write)
  - `createRouteHandlerClient` (API routes — read/write)
- Adds **`.eslintrc.supabase-rules.json`** with rules to forbid the old names.
- Adds **`supabase/types.ts`** scaffold and usage instructions.

## How to apply (Windows 11 friendly)

```powershell
Expand-Archive -Path .\gift-huddle-patch.zip -DestinationPath . -Force
npm run build
```

If ESLint is not picking up the extra rules, extend them in your root ESLint config:

- For `.eslintrc.json` or `.eslintrc`:

```json
{
  "extends": ["./.eslintrc.supabase-rules.json"]
}
```

- For `eslint.config.*` (flat config), add:

```js
import supabaseRules from './.eslintrc.supabase-rules.json'
export default [
  // ...your existing config
  supabaseRules,
]
```

## Generate Supabase types

Replace `supabase/types.ts` with real generated types:

```powershell
supabase gen types typescript --project-id <PROJECT_REF> --schema public > .\supabase\types.ts
```

Then type your client calls:

```ts
import type { Database } from '@/supabase/types'
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
```

_Updated 2025-10-02T14:29:48.324150Z_
