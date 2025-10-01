# Gift Huddle - Patch Delivery & Workflow

- Deliver patches only: Send `gift-huddle-patch.zip` with only changed files (paths preserved).
- No branches during beta: Apply patches directly to `main`.
- Include `BACKLOG.md` in every patch with Daily Notes and end-of-day summary.
- Use Supabase (DB/Auth/Storage). Social logins via provider redirects; email users verify and set strong password.
- Public lists shareable via link; "mark as ordered" requires sign-in.

## Apply a patch
1. Unzip `gift-huddle-patch.zip` into the repo root (allow overwrite).
2. Run `npm install`.
3. Commit to `main`.
