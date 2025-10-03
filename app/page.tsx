import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";
import Link from "next/link";

export const runtime = "nodejs";

export default async function HomePage() {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/account");
  }

  // Public landing (minimal, non-intrusive). Replace with your full hero when ready.
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Gift Huddle</h1>
      <p className="mt-3 text-gray-600 max-w-prose">
        Collect gift ideas with friends and family. Save links, plan budgets, and avoid duplicates.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link href="/login" className="rounded px-4 py-2 border hover:bg-gray-50 text-sm">Get started</Link>
        <Link href="/how-it-works" className="text-sm underline">How it works</Link>
      </div>
    </section>
  );
}
