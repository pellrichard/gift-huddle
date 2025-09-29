import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="Gift Huddle"
              width={128}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-sm text-gray-500">© {new Date().getFullYear()} Gift Huddle</span>
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            <Link href="/contact" className="hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
