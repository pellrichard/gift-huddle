# Gift Huddle – Server SSR Compatibility Patch

Replaces `src/lib/supabase/server.ts` with an `@supabase/ssr` version that:
- Exports `createServerSupabase()` for Server Components.
- Exports `createRouteHandlerSupabase(req, res)` for Route Handlers that need to **write** cookies.
- **Also exports `createClient()`** (no args) as a back-compat alias for existing imports in `app/api/*` and `app/logout/route.ts`.

## Apply

Copy this file to:

```
src/lib/supabase/server.ts
```

Then:
```
npm i @supabase/ssr
# optional cleanup:
npm remove @supabase/auth-helpers-nextjs
```

Build should pass without touching your existing route files. For logout or routes that mutate auth,
consider refactoring to `createRouteHandlerSupabase(req, res)` later so cookie writes persist explicitly.
