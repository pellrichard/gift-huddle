# Gift Huddle – CTA Bundle

This bundle contains ready-to-drop updates for all CTA buttons using <GHButton />.

## Files

- app/page.tsx (homepage hero CTA)
- app/how-it-works/page.tsx (How it Works page CTAs)
- components/Header.tsx (Login nav button as GHButton)

## Prerequisite

Ensure you have the Button system installed:

- styles/tokens.css
- styles/button.css
- components/ui/GHButton.tsx
  and import them in app/globals.css:

```css
@import '../styles/tokens.css';
@import '../styles/button.css';
```

## Install

Unzip into your repo root. It will overwrite the three files above.

Then run dev server and check:

- `/` → Hero CTA is brand pink GHButton
- `/how-it-works` → Primary + outline CTAs present
- Header → Login is outline GHButton (small)
