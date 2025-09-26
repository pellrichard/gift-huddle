import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Gift Huddle home">
          <Image src="/brand/gift-huddle-logo.svg" alt="Gift Huddle" width={170} height={50} priority />
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-8 text-sm">
          <Link href="#features" className="text-gh-ink/80 hover:text-gh-ink">Features</Link>
          <Link href="#how" className="text-gh-ink/80 hover:text-gh-ink">How it Works</Link>
          <Link href="#pricing" className="text-gh-ink/80 hover:text-gh-ink">Pricing</Link>
        </nav>
        <div className="hidden md:block">
          <Link href="/sign-in" className="btn-accent">Get Started</Link>
        </div>
      </div>
    </header>
  )
}
