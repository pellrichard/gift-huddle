# Footer Patch (Socials)

This adds a simple, responsive footer with social icons (Instagram, Facebook, X/Twitter, LinkedIn, GitHub).

## Files
- `src/components/Footer.tsx` – Tailwind-based footer using lucide-react icons
- `app/layout.with-footer.tsx` – Example layout showing where to mount `<Footer />`

## How to install site‑wide
1. Copy `src/components/Footer.tsx` into your repo.
2. Open your existing `app/layout.tsx` and add:
   ```tsx
   import Footer from "@/components/Footer";
   ...
   <body>
     {children}
     <Footer />
   </body>
   ```
3. Commit and redeploy.

### Notes
- Icons use `lucide-react` (already in your project).
- Update the `href` values in `Footer.tsx` to your real social links.
- Styling matches your current Tailwind setup.
