import Image from 'next/image'

export const metadata = {
  title: 'How it Works – Gift Huddle',
  description:
    'Affiliate links, price monitoring, and personalisation. No cost to you.',
}

export default function HowItWorks() {
  return (
    <main className='mx-auto max-w-5xl px-6 py-16 space-y-12'>
      <header className='grid md:grid-cols-2 gap-10 items-center'>
        <div>
          <h1 className='text-4xl font-bold mb-4'>How it works</h1>
          <ul className='list-disc pl-5 space-y-2 text-lg'>
            <li>No cost to you — we’re paid by affiliate partners.</li>
            <li>Price monitoring and alerts on popular items.</li>
            <li>
              Personalised suggestions from your interests and favourite shops.
            </li>
            <li>
              Your data is never shared or sold; everything is stored securely
              and encrypted.
            </li>
          </ul>
        </div>
        <div className='relative w-full aspect-square'>
          <Image
            src='/images/characters/hero-male.webp'
            alt='Person thinking about gifts'
            fill
            sizes='(min-width: 768px) 50vw, 100vw'
          />
        </div>
      </header>

      <section className='grid md:grid-cols-2 gap-10 items-center'>
        <div className='relative w-full aspect-square'>
          <Image
            src='/images/characters/group-gifting.webp'
            alt='Friends exchanging gifts'
            fill
            sizes='(min-width: 768px) 50vw, 100vw'
          />
        </div>
        <div>
          <h2 className='text-2xl font-semibold mb-3'>Make it social</h2>
          <p className='text-base text-muted-foreground'>
            Invite friends and family, coordinate gifting, and mark items as
            ordered (sign-in required).
          </p>
        </div>
      </section>
    </main>
  )
}
