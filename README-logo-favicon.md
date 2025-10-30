# Logo + Favicon update

This patch includes:

- `public/logo.svg` — redrawn Gift Huddle logo (flat, clean bow; colors updated)
- `public/favicon.ico` — multi-resolution icon derived from the gift mark (16–128px)

## Install

Unzip into your repo root and commit the two files.

### (Optional) Add explicit icons to Next metadata

In `app/layout.tsx`:

```ts
export const metadata = {
  // ...
  icons: {
    icon: '/favicon.ico',
  },
}
```

## Colors

- Ink: #0B1020
- Teal (box): #2DD4BF
- Lid (teal darker): #14B8A6
- Pink (ribbon): #FF3E8A
