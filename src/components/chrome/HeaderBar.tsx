// Server Component
import Link from "next/link";
import Image from "next/image";

export const runtime = "nodejs";

export default function HeaderBar() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/logo.svg" width={28} height={28} alt="Gift Huddle" priority />
          <span className="font-semibold text-lg tracking-tight">Gift Huddle</span>
        </Link>
        <nav className="text-sm flex items-center gap-5">
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/how-it-works" className="hover:underline">How it works</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/login" className="ml-2 rounded px-3 py-1 border hover:bg-gray-50">Log in</Link>
        </nav>
      </div>
    </header>
  );
}
