import Image from 'next/image'
import SocialButtons from '@/components/SocialButtons'

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6">
        <Image src="/brand/gift-huddle-logo.svg" alt="Gift Huddle logo" width={220} height={64} priority />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Coming soon</h1>
        <p className="text-lg md:text-xl text-gh-muted max-w-2xl">
          Build and share gift lists with friends and family. Keep surprises secret, avoid duplicates, and make gifting easy.
        </p>
        <div className="flex items-center gap-3">
          <a className="btn-accent" href="/sign-in">Sign in</a>
          <SocialButtons variant="outline" />
        </div>
        <p className="text-sm text-gh-muted">Follow us for launch updates.</p>
      </section>
    </div>
  )
}
