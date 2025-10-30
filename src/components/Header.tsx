import Link from 'next/link'
import Image from 'next/image'
import { createServerComponentClient } from '@/lib/supabase/server'
import { GHButton } from '@/components/ui/GHButton'

export default async function Header() {
  const supabase = await createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isAuthed = !!session

  const nav = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How it works' },
  ]

  return (
    <header className='w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className='mx-auto max-w-7xl px-6 h-16 flex items-center justify-between'>
        <Link
          href='/'
          className='flex items-center gap-2'
          aria-label='Gift Huddle home'
        >
          <Image
            src='/images/brand/logo.webp'
            alt='Gift Huddle'
            width={140}
            height={40}
            priority
          />
        </Link>
        <nav className='flex items-center gap-4'>
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className='text-sm hover:underline'
            >
              {l.label}
            </Link>
          ))}
          {isAuthed ? (
            <>
              <Link href='/account' className='text-sm hover:underline'>
                Account
              </Link>
              <form action='/logout' method='POST'>
                <button className='rounded-xl bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200'>
                  Log out
                </button>
              </form>
            </>
          ) : (
            <GHButton href='/login' variant='outline' size='sm'>
              Login
            </GHButton>
          )}
        </nav>
      </div>
    </header>
  )
}
