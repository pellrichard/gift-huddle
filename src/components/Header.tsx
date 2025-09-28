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
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Gift Huddle logo"
            width={32}
            height={32}
            priority
          />
          <span className="font-bold text-xl">Gift Huddle</span>
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
