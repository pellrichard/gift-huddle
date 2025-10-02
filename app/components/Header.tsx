import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between py-4 px-6">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.webp" alt="Gift Huddle" width={32} height={32} />
        <span className="font-semibold">Gift Huddle</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/how-it-works">How it works</Link>
        <Link href="/login">Login</Link>
      </nav>
    </header>
  );
}
