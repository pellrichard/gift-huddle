# Gift Huddle – Documentation & Changelog

This folder is the single source of truth for reference materials **and** the full changelog.

- For contribution conventions, see [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- For release steps, see [`RELEASE.md`](./RELEASE.md)
- Brand specs live in [`brand/logo-guidelines.md`](./brand/logo-guidelines.md)
- Product principles in [`product/how-it-works.md`](./product/how-it-works.md)

---

## Changelog

> Versioning: semantic (MAJOR.MINOR.PATCH). Dates in Europe/London.

### v0.6.0 — unreleased

**Planned**

- Header-optimized WebP logo (transparent, tight crop, ~32px height, 5px padding above bow & below present).
- Set `/public/logo.webp` as canonical reference across header/footer/OG meta/favicon.
- Add icon-only variant for small contexts.
- Documentation bundle added under `/documentation` with brand and product references.

### v0.5.0 — 2025-09-28

**Added**

- Rebuilt header nav with **Features**, **How it works**, and **Login** (`<GHButton variant="outline" size="sm" />`).
- Footer wired with accessible **Facebook** and **LinkedIn** SVG icons (hover styles).
- `styles/tokens.css`, `button.css`, and reusable `<GHButton />` component (CTAs refactored to use it).
- Homepage hero uses `hero-female.webp` with `<GHButton />`.
- **How it Works** page uses `hero-male.webp`, `group-gifting.webp`, and CTA buttons.
- Plausible analytics snippet (env-gated).

**Changed**

- Removed **Pricing** page.
- Cleaned obsolete root `/components` folder.
- Header wired to display logo.
- Delivered brand assets (full-color SVG, wordmark/mono SVGs, transparent WebP, favicon set).

**Known Issues / To Fix**

- **Logo quality in header**: SVG looks off; WebP correct but too tall visually.
- Need **header-optimized logo (WebP)**: transparent, tight crop, ~32px header height with **exactly 5px** padding above bow and below present.
- Decide canonical logo path (e.g., `/public/logo.webp`) used by header, footer, OG meta, and favicon.
- Optional: provide icon-only version (gift box + bow) for mobile and favicons.

### v0.4.0 — 2025-09-26

**Added**

- Initial “How it works” content draft covering affiliate model, price monitoring, and user preferences.
- Clear statement: free to users; revenue via affiliates; data never shared/sold; stored securely & encrypted.

**Changed**

- Header CTAs aligned with design tokens.

**Removed**

- Legacy image references causing hero breakages.

### v0.3.0 — 2025-09-25

**Added**

- Social accounts connected (Facebook, LinkedIn) for footer icons.
- Repo cleanup: standardized assets and public folder prep.

### v0.2.0 — 2025-09-24

**Added**

- Next.js 15 setup stabilized; basic pages scaffold.

### v0.1.0 — 2025-09-21

**Initial**

- Project bootstrap, initial branding exploration, domain setup.

---

## Working Agreements (quick reference)

- **Canonical logo**: once finalized, lives at `/public/logo.webp`.
- **Header logo size**: displays at ~32px height; source file must be tightly cropped per brand spec.
- **CTAs**: always use `<GHButton />` (variants in `button.css`).
- **Analytics**: Plausible enabled only when env var is set.
- **No pricing page** (removed); nav is **Features**, **How it works**, **Login**.

---
