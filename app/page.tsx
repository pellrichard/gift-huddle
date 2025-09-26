// app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          The Smart Way to Share Gifts
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Create wish lists, invite friends and family, and discover the perfect
          gift — all free to use, powered by affiliates and personalization.
        </p>

        <Link
          href="/login"
          className="rounded-xl bg-primary px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-primary/90"
        >
          Get Started
        </Link>

        <div className="mt-14 flex justify-center">
          <Image
            src="/hero.png"
            alt="Gift Huddle preview"
            width={800}
            height={500}
            className="rounded-2xl shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}
