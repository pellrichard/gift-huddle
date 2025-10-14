export const runtime = "nodejs";

import Link from "next/link";
import Image from "next/image";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function Header() {
  let isAuthed = false;
  try {
    const supabase = await createServerComponentClient();
    const { data: { session } } = await supabase.auth.getSession();
    isAuthed = !!session;
  } catch {
    // Fail closed: show logged-out header if auth check crashes
    isAuthed = false;
  }

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Gift Huddle"
            width={32}
            height={32}
            priority
          />
          <span className="font-semibold">Gift Huddle</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-gray-700">
          <Link href="/how-it-works" className="hover:text-gray-900" prefetch={false}>How it works</Link>
          <Link href="/login" className="hover:text-gray-900" prefetch={false}>Login</Link>
          {isAuthed ? (
            <>
              <Link href="/account" className="hover:text-gray-900" prefetch={false}>Account</Link>
              <form action="/logout" method="POST">
                <button type="submit" className="rounded-xl bg-gray-100 px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-200">Log out</button>
              </form>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
