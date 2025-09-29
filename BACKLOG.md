# Gift Huddle – Backlog

## ⚠️ Outstanding
(Active tasks only – move items here from Daily Notes as backlog until completed.)

* Convert **Baloo 2 wordmark** to proper outlined paths (no font dependency in SVG).
* Confirm **header logo scaling** (~32px height, tight crop).
* Test **favicons across browsers** (Safari pinned tabs, Windows, Android).
* Ensure **Baloo 2 loads consistently** (no FOUT/flash).
* Consider **additional logo variants** (mono, dark mode, high-contrast).
* Verify **app/layout.tsx** vs. nested layouts if header still doesn’t show everywhere.

---

## ✅ Completed
(Tasks moved here when resolved.)

* New Logo & Icon delivered (teal present with pink outline/ribbon, bow on top).
* Font switched to **Baloo 2** via `next/font`.
* Header & Footer updated with logo and nav links (Features, How it works, Login).
* Favicons generated and docs provided.
* Documentation updated with v0.6.0 changelog stub + BACKLOG.md created.
* Brand patch, favicon patch, and header/footer hotfix delivered.

---

## Daily Notes
(Running log of day-to-day progress. Each section is appended with date.)

## Daily Notes – 2025-09-29

### ✅ Completed Today
* **New Logo & Icon**
  * Teal present with pink outline/ribbon, lid overhang, bow on top.
  * Wordmark in **Baloo 2 Bold**.
  * Delivered as `public/gift-huddle-logo.svg` (full lockup) + `public/gift-huddle-icon.svg` (icon-only).
* **Font**
  * Sitewide font switched to **Baloo 2** via `next/font`.
* **Header & Footer**
  * Updated to display new logo (header) and icon (footer).
  * Nav links: **Features**, **How it works**, **Login**.
* **Favicons**
  * Full set generated (`favicon.ico`, PNGs 16–512px, `site.webmanifest`).
  * Install snippet provided in `FAVICON-INSTALL.html`.
* **Docs**
  * `/README.md` updated with v0.6.0 changelog stub.
  * `BACKLOG.md` created to track outstanding items.
* **Patches delivered**
  * Brand patch with logos, favicons, and docs.
  * Hotfix for build issues (fonts.ts + `<img>` for SVGs).
  * Header/Footer restore patch (ensures they render via `app/layout.tsx`).

### ⚠️ Outstanding / Backlog
* Convert **Baloo 2 wordmark** to proper outlined paths (no font dependency in SVG).
* Confirm **header logo scaling** (~32px height, tight crop).
* Test **favicons across browsers** (Safari pinned tabs, Windows, Android).
* Ensure **Baloo 2 loads consistently** (no FOUT/flash).
* Consider **additional logo variants** (mono, dark mode, high-contrast).
* Verify **app/layout.tsx** vs. nested layouts if header still doesn’t show everywhere.

### 👉 Next Steps (Tomorrow)
1. Verify if the **header + footer render properly in production** after the restore patch.
2. Tick off favicon/browser checks.
3. Start outlining or preparing the **Baloo 2 wordmark** as paths.


---

## 🤖 ChatGPT Context
(This section is for guiding how ChatGPT and user collaborate on backlog management.)

- Daily Notes are appended here each session to capture work done and next steps.
- Outstanding section only shows **active items** not yet finished.
- Completed section grows over time as tasks are resolved.
- GitHub and Vercel logs track commit/build history, so no need to duplicate that here.
- ChatGPT should always move items between sections as they are completed or created.
