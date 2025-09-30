# Cookie Debugging – Quick Steps

1. **DevTools → Application → Cookies → https://www.gift-huddle.com**
   - You should see cookies like `sb-<project-ref>-auth-token` and `sb-...-refresh-token`.
2. **If missing:**
   - Confirm Supabase **Site URL** and **Additional Redirect URLs** (see INSTALL.md).
   - Ensure your domain **exactly** matches (`www.gift-huddle.com` vs `gift-huddle.com`).
   - Try disabling any `secure: false` overrides locally; on HTTPS, cookies must be `Secure`.
3. **Cross-browser checks:**
   - Safari and Firefox may block third-party cookies in iframes; test in a top-level tab.
4. **Server-side check:**
   - Add a debug card on `/account` to `await supabase.auth.getSession()` server-side and render the email when present.
5. **After provider link:**
   - The UI should read `link_error` from the URL and show a toast if present.
