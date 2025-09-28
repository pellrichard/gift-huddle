import Link from "next/link";
import Logo from "@/public/gift-huddle-logo.svg";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="h-8 w-auto" aria-label="Gift Huddle" />
      </Link>
      {/* nav links… */}
    </header>
  );
}
