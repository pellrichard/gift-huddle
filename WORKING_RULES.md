# Gift Huddle – Working Rules (Project-Wide)

> Version: 2025-10-01

These rules define **how we work** across chats. If we agree to change any rule in a chat,
we will update this file so future sessions are consistent.

---

## Patch Delivery

- **Always deliver patch zips**, never the whole repo.
- Patch zips **preserve folder paths** so you can unzip directly into repo root.
- Filename is always **`gift-huddle-patch.zip`**.
- **Every patch includes the latest `BACKLOG.md`** (even if unrelated).

### Apply a patch (copy & paste friendly)

1. Download `gift-huddle-patch.zip`.
2. Unzip **into the repo root** (it contains correct folder paths).
3. Review changes in your Git tool (optional).
4. Commit and push, then deploy (Vercel).

> If any patch requires changes to Supabase/Vercel settings, the patch contains a `README_*.md`
> with step-by-step instructions.

---

## Daily Notes in `BACKLOG.md`

- Each patch appends to `## Daily Notes – YYYY-MM-DD`.
- At end of the day, add a **`### 📌 End of Day Summary`** snapshot.
- Outstanding tasks can be cloned into the summary snapshot for context.
- Completed items are tagged with the date they were finished.

---

## Outstanding & Completed

- **⚠️ Outstanding** only contains active tasks (deduped).
- **✅ Completed** is grouped by **date headers** (reverse chronological).
- Every day has a *Completed* date header, even if it’s “- (no items yet)”.

---

## Documentation Placement

- All docs (`BACKLOG.md`, `README.md`, `FAVICON-INSTALL.html`, etc.) live in **repo root**.
- Brand assets stay in `public/`.
- New docs go to the repo root unless specified otherwise.

---

## Collaboration Notes

- User prefers **copy–paste patches** (zip) to drop into repo directly.
- No extra manifest/versioning needed — trust-based patches.
- GitHub + Vercel logs provide build/commit history; `BACKLOG.md` focuses on tasks + notes.
- ChatGPT may keep a **🤖 Context** section in `BACKLOG.md` to track these working rules.

---

## Changing How We Work

If we propose a process change during a chat, we will **explicitly confirm** whether it is:
- **Project-wide** (update this file), or
- **Chat-only** (temporary; do not update this file).

Once confirmed as project-wide, we will **update this file in the next patch** to keep
consistency across future sessions.
