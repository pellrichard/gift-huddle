'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const nav = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How it works' },
  ];
  return (
    <header className="w-full sticky top-0 bg-white/80 backdrop-blur z-40 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">Gift Huddle</Link>
        <nav className="hidden md:flex gap-6">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={
                'text-sm hover:opacity-80 ' + (pathname === item.href ? 'font-semibold' : '')
              }>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm">Login</Link>
        </div>
      </div>
    </header>
  );
}
