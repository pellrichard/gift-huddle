import Link from "next/link";
import { GHButton } from "@/components/ui/GHButton";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
];

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">Gift Huddle</Link>
        <nav className="flex items-center gap-4">
          {navLinks.map((l) => (
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
