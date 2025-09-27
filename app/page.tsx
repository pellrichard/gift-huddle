<<<<<<< HEAD
// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar is assumed elsewhere; this is just the hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10 md:pt-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              Plan, share, and <br /> celebrate together.
            </h1>
            <p className="mt-4 max-w-xl text-gray-600">
              Create gift lists for birthdays, weddings, holidays, and more. Set budgets,
              get reminders, and avoid duplicate gifts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: "#ff5891" }} // pink like your screenshot
              >
                Get Started
              </Link>

              <Link
                href="/features"
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Explore Features
              </Link>
            </div>
          </div>

          <div className="relative mx-auto max-w-md md:max-w-none">
            <Image
              src="/hero-illustration.png" // or .svg if that’s what you have
              alt="Gift Huddle hero"
              width={560}
              height={420}
              priority
            />
          </div>
        </div>
      </section>

      {/* footer icons row can remain as-is */}
=======
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import SocialButtons from '@/components/SocialButtons'

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="border-t" />
      <Features />
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-between">
          <p className="text-sm text-gh-muted">© 2025 Gift Huddle</p>
          <SocialButtons variant="ghost" />
        </div>
      </footer>
>>>>>>> parent of ad3b10d (hero update)
    </main>
  )
}
