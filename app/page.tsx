// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
              Create gift lists for birthdays, weddings, holidays, and more. Set
              budgets, get reminders, and avoid duplicate gifts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild variant="default">
                <Link href="/get-started">Get Started</Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/features">Explore Features</Link>
              </Button>
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
