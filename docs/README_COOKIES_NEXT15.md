# Next.js 15 cookies() change

Next.js 15 makes `cookies()` async. We updated the Supabase server client factory:

```ts
import { cookies } from "next/headers";
export async function createClient() {
  const cookieStore = await cookies();
  // ...
}
```

And any callers (e.g., API/route handlers) need to `await createClient()`.
Both `src/lib/supabase/*` and legacy `lib/supabase/*` are included to cover mixed imports.
