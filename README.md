# Gift Huddle – My Account Page (Drop-in)

## Files
- `app/account/page.tsx` – routes `/account` to the component.
- `components/account/AccountPage.tsx` – the page UI with mock data.
- `styles/theme.css` – brand tokens (CSS variables).
- `public/images/**` – placeholder assets used by the mock data.

## Install
1. Copy everything into your Next.js repo, preserving folders.
2. Import `styles/theme.css` once (e.g., in `app/layout.tsx`):  
   `import "@/styles/theme.css";`
3. Ensure `shadcn/ui` components are available (`button`, `card`, `input`, `avatar`, `badge`).

## Tailwind (optional but recommended)
Map your font and expose color tokens in `tailwind.config.js`:

```js
const { fontFamily } = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--gh-primary-50)",
          100: "var(--gh-primary-100)",
          200: "var(--gh-primary-200)",
          600: "var(--gh-primary-600)",
          700: "var(--gh-primary-700)",
        },
        surface: "var(--gh-surface)",
      },
      fontFamily: { sans: ["var(--font-sans)", ...fontFamily.sans] },
    },
  },
};
```

## Supabase wiring (next step)
- Replace mock arrays with queries to `profiles`, `events`, `lists`, `list_items`, `price_history`.
- Price Watch: items where `price_current < price_baseline` (or baseline from history).

## Notes
- Placeholder images are simple branded blocks to avoid 404s.
- All brand colors are via CSS variables so site-wide theming applies instantly.
