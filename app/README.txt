# Styling Fix for Gift Huddle

Symptoms: page renders unstyled classes (Tailwind not applied).

This bundle includes:
- app/globals.css (with @tailwind directives + brand tokens)
- tailwind.config.ts (content globs for app/ and src/)
- postcss.config.js

Steps:
1) Ensure globals is imported in app/layout.tsx -> `import './globals.css'`
2) Install deps (if not already):
   npm i -D tailwindcss postcss autoprefixer
3) Drop files at repo root (tailwind.config.ts, postcss.config.js) and replace app/globals.css with this content.
4) Commit & push.
