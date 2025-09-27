"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Plan, share, and celebrate together.
        </h1>
        <p className="text-lg text-gray-600">
          Create gift lists for birthdays, weddings, holidays, and more. Set budgets, get reminders,
          and avoid duplicate gifts.
        </p>
        <div className="flex gap-3">
          <a href="/login" className="rounded-xl bg-[#F9628D] px-5 py-3 text-white font-medium shadow hover:opacity-90">
            Get Started
          </a>
          <a href="/features" className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50">
            Explore Features
          </a>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3]">
        <Image
          src="/img/hero-wishlist.png"
          alt="Person using a laptop thinking about gifts"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-contain drop-shadow-sm"
        />
      </div>
    </section>
  );
}
