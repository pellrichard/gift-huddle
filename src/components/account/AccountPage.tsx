'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  banner_url: string | null
  categories?: string[] | null
}

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session?.user) {
          if (mounted) {
            setProfile(null)
            setLoading(false)
          }
          return
        }
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
        if (error) throw error
        if (mounted) {
          setProfile((data ?? null) as Profile | null)
          setLoading(false)
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Failed to load profile')
          setLoading(false)
        }
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className='p-6'>Loading your account…</div>

  if (!profile) {
    return (
      <div className='p-6'>
        <h1 className='text-2xl font-semibold mb-2'>You’re not signed in</h1>
        <p className='mb-4 text-gray-600'>
          Please log in to view your account.
        </p>
        <Link
          href='/login'
          className='rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700'
        >
          Go to Login
        </Link>
        {error && <p className='mt-4 text-sm text-red-600'>{error}</p>}
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='mb-4'>
        <Image
          src={profile.banner_url ?? '/banners/default.webp'}
          alt=''
          width={1600}
          height={320}
          className='h-40 w-full object-cover rounded-2xl'
        />
      </div>
      <div className='flex items-center gap-4'>
        <Image
          src={profile.avatar_url ?? '/avatars/default.webp'}
          alt={profile.full_name ?? ''}
          width={96}
          height={96}
          className='h-24 w-24 rounded-full object-cover ring-4 ring-white'
        />
        <div>
          <h1 className='text-xl font-semibold'>
            {profile.full_name ?? 'Your Name'}
          </h1>
          {profile.categories && profile.categories.length > 0 && (
            <div className='mt-1 flex flex-wrap gap-2'>
              {profile.categories.map((c) => (
                <span
                  key={c}
                  className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700'
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
