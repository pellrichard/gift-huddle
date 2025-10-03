// Server Component
import Link from "next/link";
import Image from "next/image";

export const runtime = "nodejs";

function SocialIcon({ label, href, path }: { label: string; href: string; path: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-gray-50"
      title={label}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

const ICONS = {
  linkedin: "M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8.5h4V23h-4V8.5ZM8.98 8.5H13v2h.06c.56-1.06 1.93-2.18 3.97-2.18 4.25 0 5.03 2.8 5.03 6.45V23h-4v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.69-2.49 3.43V23h-4V8.5Z",
  facebook: "M14.5 8H17V4h-2.5c-3.04 0-5 1.83-5 5v2H7v4h2.5V24h4v-9H17l1-4h-3.5V9c0-.83.17-1 1-1Z",
};

export default function FooterBar() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-700 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Gift Huddle Home">
            <Image src="/assets-bundle/svg/Gift-Huddle.svg" alt="Gift Huddle" width={24} height={24} />
            <span className="font-medium">Gift Huddle</span>
          </Link>
          <div className="flex items-center gap-3">
            <SocialIcon label="Connect on LinkedIn" href="https://www.linkedin.com/company/gift-huddle" path={ICONS.linkedin} />
            <SocialIcon label="Like on Facebook" href="https://www.facebook.com/profile.php?id=61581098625976" path={ICONS.facebook} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>© {year} Gift Huddle</div>
          <nav className="flex items-center gap-5">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
