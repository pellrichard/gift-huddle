# Tailwind PostCSS Fix (Next 15 / Tailwind v4)

Your build error indicates Tailwind v4 is being used, which requires the new PostCSS plugin package.

## Do this:

1) **Install the correct packages**
   ```bash
   npm i -D tailwindcss @tailwindcss/postcss
   ```
   > (Remove `autoprefixer` from `postcss.config.js`; Tailwind v4 handles it via the new plugin.)

2) **Replace `postcss.config.js`** with the one in this bundle:
   ```js
   module.exports = {
     plugins: { '@tailwindcss/postcss': {} },
   }
   ```

3) Keep `app/globals.css` with:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4) If you still have issues, clear cache and rebuild:
   ```bash
   rm -rf .next node_modules && npm i && npm run build
   ```
