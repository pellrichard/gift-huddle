import Link from 'next/link'
import Image from 'next/image'
import SocialButtons from '@/components/SocialButtons'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Gift Huddle home">
          <Image
            src="/brand/gift-huddle-logo.svg"
            alt="Gift Huddle"
            width={160}
            height={48}
            priority
          />
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link className="text-gh-ink/80 hover:text-gh-ink" href="/lists">Lists</Link>
          <Link className="text-gh-ink/80 hover:text-gh-ink" href="/discover">Discover</Link>
          <div className="hidden sm:flex">
            <SocialButtons variant="ghost" />
          </div>
          <Link className="btn-accent" href="/sign-in">Sign in</Link>
        </nav>
      </div>
    </header>
  )
}
