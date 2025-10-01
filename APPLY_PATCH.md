# Apply Patch – Gift Huddle

**This repository uses patch-based updates.**

## Steps

1. Download **`gift-huddle-patch.zip`**.
2. Unzip **into the repository root** (paths are preserved).
3. Review changes (optional): `git status`, `git diff`.
4. Commit & push:
   ```bash
   git add -A
   git commit -m "Apply gift-huddle patch (2025-10-01)"
   git push
   ```
5. Deploy on Vercel.
6. If the patch includes any `README_*` instructions (e.g. Supabase/Vercel settings), follow them now.

## Notes
- We do **not** use branches during beta — patches are applied on the active branch.
- If we change the way we work in chat, we will confirm whether it’s **project-wide**
  (then update `WORKING_RULES.md`) or **chat-only** (temporary).
