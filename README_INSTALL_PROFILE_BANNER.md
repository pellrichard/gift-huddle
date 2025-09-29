# Gift Huddle — Profile Banner & Avatar Patch

This patch:
- Adds `avatar_url` and `banner_url` columns to `profiles`
- Creates a public storage bucket `profile-assets` with RLS (public read, users can manage their own files)
- Adds `ProfileBanner` UI to upload/change banner and avatar
- Mounts the banner above the `ProfileForm` on `/account`

## Install (commit to main)
```bash
# unzip into repo root (preserve folders)
git add .
git commit -m "feat: profile banner & avatar (storage + UI)"
git push origin main
```

## Apply SQL in Supabase
Open **Supabase → SQL Editor**, paste `supabase/migrations/2025-09-29_profile_assets.sql`, and run.

## Use
- Go to `/account`
- Click **Change banner** (wide image) or the camera button on the avatar (square)
- Files upload to `profile-assets/{user_id}/banner.ext` and `.../avatar.ext`
- URLs are saved to your `profiles` row and shown immediately
