import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      <section>
        <h1 className="text-4xl font-bold mb-4">Better gifting with your crew</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Build lists, invite friends, track prices, and never double-buy again.
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
