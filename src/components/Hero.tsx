import Image from 'next/image'

export default function Hero() {
  return (
    <section className='mx-auto max-w-6xl px-4 pt-10 pb-14 grid md:grid-cols-2 gap-10 items-center'>
      <div className='order-2 md:order-1'>
        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight'>
          Plan, share, and
          <br />
          celebrate together.
        </h1>
        <p className='mt-5 text-lg text-gh-muted max-w-prose'>
          Create gift lists for birthdays, weddings, holidays, and more. Set
          budgets, get reminders, and avoid duplicate gifts.
        </p>
        <div className='mt-6 flex items-center gap-3'>
          <a href='/sign-in' className='btn-accent'>
            Get Started
          </a>
        </div>
      </div>
      <div className='order-1 md:order-2 flex justify-center'>
        <Image
          src='/illustrations/hero-clipboard.svg'
          alt=''
          width={520}
          height={360}
        />
      </div>
    </section>
  )
}
