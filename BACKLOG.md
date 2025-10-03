### 2025-10-04 – OAuth logos + callback redirect + branding path

- **Branding:** Header & Footer now use `/assets-bundle/svg/Gift-Huddle.svg` (fixes broken logos).
- **Login buttons:** Added official provider logos hosted by Google & Facebook:
  - Google: https://developers.google.com/identity/images/g-logo.png
  - Facebook: https://www.facebook.com/images/fb_icon_325x325.png
  (Configured in `next.config.js` to allow these external images.)
- **OAuth callback:** `/auth/callback` now always redirects to `next` (default `/account`) instead of returning to `/login`.
  This avoids landing on `/login#_=_` after successful auth.
