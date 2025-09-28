import Link from "next/link";
import Image from "next/image";
import { GHButton } from "@/components/ui/GHButton";

const nav = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
];

export default function Header() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Gift Huddle home">
          <Image src="/images/brand/logo.webp" alt="Gift Huddle" width={140} height={40} priority />
        </Link>
        <nav className="flex items-center gap-4">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm hover:underline">
              {l.label}
            </Link>
          ))}
          <GHButton href="/login" variant="outline" size="sm">
            Login
          </GHButton>
        </nav>
      </div>
    </header>
  );
}
