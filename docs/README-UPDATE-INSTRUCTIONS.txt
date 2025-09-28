# Gift Huddle Landing Restore PR

## Steps to Apply

1. Unzip contents into your project root (same level as `app/` folder).

2. Make sure your hero image exists at:
   public/hero-illustration.png

   If not, copy your preferred illustration there and ensure the casing matches exactly.

3. In `app/page.tsx` (or Hero.tsx if separated):
   - Ensure the "Get Started" button uses the locked pink style:

     <Link
       href="/get-started"
       className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
       style={{ backgroundColor: "#ff5891" }}
     >
       Get Started
     </Link>

   - Update the hero illustration reference:

     <Image
       src="/hero-illustration.png"
       alt="Gift Huddle hero"
       width={560}
       height={420}
       priority
     />

4. Stage, commit, and push your changes:

   git add app/features/page.tsx app/how-it-works/page.tsx app/pricing/page.tsx app/page.tsx public/hero-illustration.png
   git commit -m "feat: restore classic landing hero + add stub pages for navbar"
   git push -u origin fix/restore-landing

5. Open a Pull Request on GitHub:
   - Base: feat/complete-refresh (or main if that's your deploy branch)
   - Compare: fix/restore-landing
   - Title: Restore classic landing hero + stub pages
   - Description: 
     - Reverts homepage to original hero layout
     - Locks "Get Started" button pink
     - Adds stub pages (Features, How It Works, Pricing) to prevent 404s
     - Ensures hero illustration asset loads correctly
