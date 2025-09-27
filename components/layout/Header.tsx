// components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Features", href: "/features" },
  { name: "How it Works", href: "/how-it-works" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">Gift Huddle</Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium ${pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/login"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
