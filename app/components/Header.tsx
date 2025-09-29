import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.webp"
            alt="Gift Huddle"
            width={128}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="sr-only">Gift Huddle</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/features" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Features
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            How it works
          </Link>
          <Link href="/account" className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
