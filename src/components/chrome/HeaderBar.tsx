// Server Component
import Image from "next/image";

export const runtime = "nodejs";

export default function HeaderBar() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <a href="/" className="inline-flex items-center gap-2">
          <Image src="/logo.svg" width={28} height={28} alt="Gift Huddle" priority />
          <span className="font-semibold text-lg tracking-tight">Gift Huddle</span>
        </a>
        <nav className="text-sm flex items-center gap-5">
          <a href="/features" className="hover:underline">Features</a>
          <a href="/how-it-works" className="hover:underline">How it works</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/login" className="ml-2 rounded px-3 py-1 border hover:bg-gray-50">Log in</a>
        </nav>
      </div>
    </header>
  );
}
