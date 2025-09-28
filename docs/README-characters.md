# Gift Huddle – Characters Image Pack

This bundle adds the hero and character illustrations (PNG + WEBP) and shows how to wire them up in Next.js (App Router).

## Files
- `public/images/characters/hero-female.png` / `.webp`  ← **Homepage hero**
- `public/images/characters/hero-male.png` / `.webp`
- `public/images/characters/group-gifting.png` / `.webp`

## Usage (Next.js 13+ App Router)
Recommended: use `next/image` and prefer WEBP with PNG fallback via `srcSet` or by letting Next optimize the WEBP directly.

### Homepage hero example (`app/page.tsx`)
```tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      <section>
        <h1 className="text-4xl font-bold mb-4">Better gifting with your crew</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Build lists, invite friends, track prices, and never double‑buy again.
        </p>
        <a href="/signup" className="inline-block rounded-2xl px-6 py-3 bg-pink-500 text-white font-semibold">
          Get Started
        </a>
      </section>

      <div className="relative w-full aspect-square">
        <Image
          src="/images/characters/hero-female.webp"
          alt="Person planning gifts on a laptop"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
    </main>
  );
}
```

### How it Works page snippet (place `app/how-it-works/page.tsx`)
```tsx
import Image from "next/image";

export const metadata = {
  title: "How it Works – Gift Huddle",
  description: "Affiliate links, price monitoring, and personalisation. No cost to you.",
};

export default function HowItWorks() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-12">
      <header className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">How it works</h1>
          <ul className="list-disc pl-5 space-y-2 text-lg">
            <li>No cost to you — we’re paid by affiliate partners.</li>
            <li>Price monitoring and alerts on popular items.</li>
            <li>Personalised suggestions from your interests and favourite shops.</li>
            <li>Your data is never shared or sold; everything is stored securely and encrypted.</li>
          </ul>
        </div>
        <div className="relative w-full aspect-square">
          <Image
            src="/images/characters/hero-male.webp"
            alt="Person thinking about gifts"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative w-full aspect-square">
          <Image
            src="/images/characters/group-gifting.webp"
            alt="Friends exchanging gifts"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3">Make it social</h2>
          <p className="text-base text-muted-foreground">
            Invite friends and family, coordinate gifting, and mark items as ordered (sign-in required).
          </p>
        </div>
      </section>
    </main>
  );
}
```

## Notes
- Prefer `.webp` in `src` — Next will optimise and serve the best variant.
- Keep the PNGs for compatibility, marketing exports, or if you need lossless assets.
- Paths are absolute from `public/` — e.g. `/images/characters/hero-female.webp`.
- If you use TypeScript strict mode and have custom Image loaders, ensure `/public` is allowed.

## Changelog
- Added three character illustrations as PNG and WEBP.
- Added example pages/snippets to help wire them up.
