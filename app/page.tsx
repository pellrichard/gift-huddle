import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
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
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                style={{ backgroundColor: "#ff5891" }}
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
              src="/hero-illustration.png"
              alt="Gift Huddle hero"
              width={560}
              height={420}
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
