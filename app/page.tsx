import Hero from '@/components/Hero'
import Features from '@/components/Features'
import SocialButtons from '@/components/SocialButtons'

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="border-t" />
      <Features />
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-between">
          <p className="text-sm text-gh-muted">© {new Date().getFullYear()} Gift Huddle</p>
          <SocialButtons variant="ghost" />
        </div>
      </footer>
    </main>
  )
}
