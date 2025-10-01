import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.svg"
              alt="Gift Huddle"
              width={128}
              height={32}
              className="h-8 w-auto"
            />
<div className="ml-1 flex items-center gap-3 text-gray-500">
              <a
                href="https://www.facebook.com/profile.php?id=61581098625976"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-gray-900"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12.06C22 6.477 17.523 2 11.94 2 6.357 2 1.88 6.477 1.88 12.06c0 4.99 3.658 9.132 8.438 9.932v-7.02H7.898v-2.912h2.42V9.845c0-2.39 1.424-3.71 3.604-3.71 1.043 0 2.135.186 2.135.186v2.35h-1.202c-1.186 0-1.556.737-1.556 1.492v1.793h2.644l-.422 2.912h-2.222v7.02C18.342 21.192 22 17.05 22 12.06Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/gift-huddle/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-gray-900"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v15H0V8zm7.5 0H12v2.2h.06c.62-1.17 2.14-2.4 4.4-2.4 4.71 0 5.58 3.1 5.58 7.14V23H17v-6.7c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.73-2.57 3.54V23H7.5V8z"/>
                </svg>
              </a>
            </div>
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
