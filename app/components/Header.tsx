// app/components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-2">
        <img src="/gift-huddle-logo.svg" alt="Gift Huddle" className="h-8 w-auto" />
      </Link>
      {/* nav links… */}
    </header>
  );
}
