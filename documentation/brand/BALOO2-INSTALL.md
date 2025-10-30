# Baloo 2 Integration

We switched Gift Huddle to **Baloo 2** for a playful, modern look.

## Usage in Next.js (recommended)

```ts
// app/fonts.ts
import { Baloo_2 } from 'next/font/google'

export const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-baloo2',
})
```

```tsx
// app/layout.tsx
import { baloo2 } from './fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={baloo2.variable}>
      <body>{children}</body>
    </html>
  )
}
```

```css
/* globals.css */
:root {
  --font-baloo2: system-ui;
}
html {
  font-family:
    var(--font-baloo2),
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    Arial,
    sans-serif;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
}
```

## Quick link-based load (not recommended for prod)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
<style>
  html {
    font-family:
      'Baloo 2',
      ui-sans-serif,
      system-ui,
      -apple-system,
      'Segoe UI',
      Roboto,
      Arial,
      sans-serif;
  }
</style>
```
