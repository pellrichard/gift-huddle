"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [logoFailed, setLogoFailed] = React.useState(false);

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {!logoFailed ? (
            <Image
              src="/logo.webp"
              alt="Gift Huddle"
              width={128}
              height={32}
              className="h-8 w-auto"
              priority
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <svg
              width="128"
              height="32"
              viewBox="0 0 128 32"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-auto"
              role="img"
              aria-label="Gift Huddle"
            >
              <rect x="0" y="0" width="32" height="32" rx="6" fill="#ec4899" />
              <rect x="6" y="10" width="20" height="16" rx="3" fill="white" />
              <rect x="6" y="12" width="20" height="3" fill="#ec4899" />
              <path d="M16 4c3 0 6 3 6 6h-4c0-1.1-.9-2-2-2s-2 .9-2 2h-4c0-3 3-6 6-6z" fill="white"/>
              <text x="40" y="22" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fontSize="14" fill="#111827">
                Gift Huddle
              </text>
            </svg>
          )}
          <span className="sr-only">Gift Huddle</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/features" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Features
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            How it works
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
            prefetch={false}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
