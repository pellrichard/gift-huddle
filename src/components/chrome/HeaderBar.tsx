// Server Component
import Link from "next/link";
import Image from "next/image";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export default async function HeaderBar() {
  let userId: string | null = null;

  try {
    const supabase = createServerComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    userId = null;
  }

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2">
          {/* Use the repo's canonical SVG logo under /public */}
          <Image src="/logo.svg" width={28} height={28} alt="Gift Huddle" priority />
          <span className="font-semibold text-lg tracking-tight">Gift Huddle</span>
        </Link>

        <nav className="text-sm flex items-center gap-5">
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/how-it-works" className="hover:underline">How it works</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>

          {userId ? (
            <>
              <Link href="/account" className="ml-2 rounded px-3 py-1 border hover:bg-gray-50">My account</Link>
              <Link href="/logout" className="rounded px-3 py-1 border hover:bg-gray-50">Log out</Link>
            </>
          ) : (
            <Link href="/login" className="ml-2 rounded px-3 py-1 border hover:bg-gray-50">Log in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
