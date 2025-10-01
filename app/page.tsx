import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { GHButton } from "@/components/ui/GHButton";

export default async function Home() {
  const c = await cookies();
  if (c.get("sb-access-token") || c.get("sb-refresh-token") || c.get("supabase-auth-token")) {
    redirect("/account");
  }
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      <section>
        <h1 className="text-4xl font-bold mb-4">Better gifting with your crew</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Build lists, invite friends, track prices, and never double-buy again.
        </p>

        <GHButton href="/signup" variant="primary" size="md">
          Get Started
        </GHButton>
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
