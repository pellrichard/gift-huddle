# Gift Huddle – Server SSR Patch

This replaces `src/lib/supabase/server.ts` to remove the dependency on
`@supabase/auth-helpers-nextjs` and use `@supabase/ssr` instead.

## Exports

- `createServerSupabase()` — for Server Components / RSC.
- `createRouteHandlerSupabase(req, res)` — for Route Handlers / API routes.

## Apply

Copy this file to your repo at the same path:

```
src/lib/supabase/server.ts
```

Then commit and run a build.

## Notes

- Make sure `@supabase/ssr` is installed (it already should be, but if not):

  ```bash
  npm i @supabase/ssr
  ```

- After this change you can (optionally) remove `@supabase/auth-helpers-nextjs` if
  nothing else imports it:
  ```bash
  npm remove @supabase/auth-helpers-nextjs
  ```
