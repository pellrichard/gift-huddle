# Release Checklist

1. **Docs**
   - Update `/documentation/README.md` changelog with version & date.
   - Ensure brand spec matches the shipped header logo.

2. **Assets**
   - Confirm `/public/logo.webp` is the canonical logo and tightly cropped.
   - Favicon bundle up to date.

3. **UI sanity**
   - Header: logo renders crisp at ~32px height.
   - CTAs using `<GHButton />`.
   - “How it works” links and images load.

4. **Analytics**
   - Plausible keys present in prod only.

5. **Build & Deploy**
   - Vercel build passes.
   - Smoke test the homepage and How it Works.

6. **Tag**
   - Create git tag `vX.Y.Z` and push.
