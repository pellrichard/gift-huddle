// components/layout/Footer.tsx
"use client";

import Image from "next/image";
import { SOCIALS } from "@/lib/socials";

export default function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/icons/logo.svg" alt="Gift Huddle" width={28} height={28} />
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Gift Huddle</span>
        </div>

        <nav className="flex items-center gap-4">
          <a
            href={SOCIALS.facebook}
            aria-label="Gift Huddle on Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:underline"
          >
            <Image src="/icons/social-facebook.png" alt="" width={20} height={20} />
            Facebook
          </a>

          <a
            href={SOCIALS.linkedin}
            aria-label="Gift Huddle on LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:underline"
          >
            <Image src="/icons/social-linkedin.png" alt="" width={20} height={20} />
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
