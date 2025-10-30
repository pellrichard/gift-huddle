import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className='relative'>
      <div className='max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center'>
        <div>
          <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
            Gift better, together.
          </h1>
          <p className='mt-4 text-lg text-gray-600'>
            Create wishlists, invite friends, and get smart suggestions from
            your favourite shops.
          </p>
          <div className='mt-8'>
            <Link
              href='/get-started'
              className='inline-block rounded-xl px-5 py-3 text-white bg-[var(--brand-pink)] hover:opacity-90 focus:outline-none focus:ring'
            >
              Get started
            </Link>
          </div>
        </div>
        <div className='relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-100'>
          <Image
            src='/hero-placeholder.svg'
            alt='Gifting hero'
            fill
            priority
            sizes='(min-width: 768px) 50vw, 100vw'
          />
        </div>
      </div>
    </section>
  )
}
