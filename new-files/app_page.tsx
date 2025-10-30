// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className='p-6'>
      <h1 className='text-2xl font-semibold'>Gift Huddle</h1>
      <p className='mt-2'>Welcome! Head to your account to manage lists.</p>
      <Link href='/account' className='mt-4 inline-block underline'>
        Go to Account
      </Link>
    </main>
  )
}
