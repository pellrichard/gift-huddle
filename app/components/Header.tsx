// app/components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/gift-huddle-logo.svg" alt="Gift Huddle" className="h-8 w-auto" />
          <span className="sr-only">Gift Huddle</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/features" className="text-sm text-gray-700 hover:text-gray-900">Features</Link>
          <Link href="/how-it-works" className="text-sm text-gray-700 hover:text-gray-900">How it works</Link>
          <Link href="/login" className="inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
