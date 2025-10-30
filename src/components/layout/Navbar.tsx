'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const NavLinks = () => (
    <>
      <Link
        href='/features'
        className='text-sm font-medium text-gray-700 hover:text-gray-900'
      >
        Features
      </Link>
      <Link
        href='/how-it-works'
        className='text-sm font-medium text-gray-700 hover:text-gray-900'
      >
        How it works
      </Link>
      <Link
        href='/pricing'
        className='text-sm font-medium text-gray-700 hover:text-gray-900'
      >
        Pricing
      </Link>
    </>
  )

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6'>
        {/* Left: Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/assets-bundle/svg/Gift-Huddle-icon.svg'
            width={28}
            height={28}
            alt='Gift Huddle logo'
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className='hidden items-center gap-8 md:flex'>
          <NavLinks />
        </nav>

        {/* Right: CTAs */}
        <div className='hidden items-center gap-3 md:flex'>
          <Button asChild variant='ghost' className='text-gray-700'>
            <Link href='/login'>Log in</Link>
          </Button>
          <Button asChild>
            <Link href='/get-started'>Get started</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label='Toggle menu'
          className='inline-flex items-center justify-center rounded-md p-2 md:hidden'
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className='border-t bg-white md:hidden'>
          <div className='mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4'>
            <NavLinks />
            <div className='mt-2 flex items-center gap-3'>
              <Button asChild variant='ghost' className='w-full justify-center'>
                <Link href='/login'>Log in</Link>
              </Button>
              <Button asChild className='w-full justify-center'>
                <Link href='/get-started'>Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
