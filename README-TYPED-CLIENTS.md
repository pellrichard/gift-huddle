# Typed Supabase clients

This patch types your Supabase server clients with `Database` from `supabase/types.ts` so calls like `.from("profiles").update(...)` are correctly typed by the schema.

**What changed**
- `lib/supabase/server.ts` and `src/lib/supabase/server.ts` now create `SupabaseClient<Database>`.
- Added optional `src/lib/types/db.ts` with handy aliases (ProfilesRow/Update/Insert).

**How to use in actions/components**
```ts
import type { Database } from "@/supabase/types";
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
```

Then:
```ts
const update: ProfileUpdate = { /* ... */ };
const { error } = await supabase
  .from("profiles")
  .update(update)
  .eq("id", user.id);
```

_Updated 2025-10-02T15:15:52.339810Z_
