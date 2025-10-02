import Link from "next/link";
import Image from "next/image";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthed = !!session;

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Gift Huddle"
            width={128}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/features" className="hover:text-gray-900" prefetch={false}>Features</Link>
          <Link href="/how-it-works" className="hover:text-gray-900" prefetch={false}>How it works</Link>
          {isAuthed ? (
            <>
              <Link href="/account" className="hover:text-gray-900" prefetch={false}>Account</Link>
              <form action="/logout" method="POST">
                <button type="submit" className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">Log out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700" prefetch={false}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

