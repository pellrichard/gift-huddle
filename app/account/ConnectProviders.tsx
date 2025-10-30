'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useMemo, useState } from 'react'
import { useToast } from '../components/ToastProvider'

type Provider = 'google' | 'facebook' | 'apple'

// Full-color brand icons (inline SVG)
const GoogleIcon = () => (
  <svg viewBox='0 0 48 48' className='h-4 w-4' aria-hidden='true'>
    <path
      fill='#FFC107'
      d='M43.6 20.5H42V20H24v8h11.3C33.6 31.9 29.2 35 24 35c-7 0-12.7-5.7-12.7-12.7S17 9.7 24 9.7c3.2 0 6.1 1.2 8.3 3.2l5.7-5.7C34.6 3.6 29.6 1.7 24 1.7 11.5 1.7 1.3 11.9 1.3 24.3S11.5 46.9 24 46.9 46.7 36.7 46.7 24.3c0-1.2-.1-2.4-.3-3.8z'
    />
    <path
      fill='#FF3D00'
      d='M6.3 14.6l6.6 4.8C14.8 16 19 13.7 24 13.7c3.2 0 6.1 1.2 8.3 3.2l5.7-5.7C34.6 7.6 29.6 5.7 24 5.7 16 5.7 9 9.9 6.3 14.6z'
    />
    <path
      fill='#4CAF50'
      d='M24 42.9c5 0 9.6-1.9 12.9-5.1l-5.9-4.8c-2 1.4-4.7 2.3-7 2.3-5.2 0-9.6-3.3-11.2-7.8l-6.6 5.1c3 6.1 9.4 10.3 16.8 10.3z'
    />
    <path
      fill='#1976D2'
      d='M43.6 20.5H42V20H24v8h11.3c-1 3.1-3.6 5.8-6.9 7.2l5.9 4.8c-0.4 0.3 7.4-4.4 7.4-15.7 0-1.2-.1-2.4-.1-3.8z'
    />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox='0 0 24 24' className='h-4 w-4' aria-hidden='true'>
    <path
      fill='#1877F2'
      d='M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-2 1-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z'
    />
    <path
      fill='#fff'
      d='M16.7 15.5L17.2 12h-3.4V9.8c0-.9.5-1.9 2-1.9h1.5V5c0 0-1.3-.2-2.6-.2-2.7 0-4.5 1.6-4.5 4.6V12H7.1v3.5h3.1v8.4c.6.1 1.3.1 1.9.1s1.3 0 1.9-.1v-8.4h2.7z'
    />
  </svg>
)

// Apple logo is monochrome by brand guidelines
const AppleIcon = () => (
  <svg viewBox='0 0 24 24' className='h-4 w-4' aria-hidden='true'>
    <path
      fill='#000000'
      d='M16.2 12.7c0-2.1 1.7-3.1 1.8-3.2-1-.1-2 .6-2.5.6-.5 0-1.3-.6-2.2-.6-1.1 0-2.2.7-2.8 1.8-1.2 2.1-.3 5.2.8 6.9.5.8 1 1.7 1.8 1.7.7 0 1-.5 2-.5s1.2.5 2 .5c.8 0 1.3-.8 1.8-1.6.5-.9.7-1.7.7-1.8-.1 0-2.6-1-2.6-3.8zM14.7 7.7c.5-.6.8-1.4.8-2.2-.8 0-1.7.5-2.2 1.1-.5.6-.9 1.4-.8 2.3.9.1 1.7-.5 2.2-1.2z'
    />
  </svg>
)

// Type for a minimal auth interface that may include linkIdentity (SDK-dependent)
type MaybeLinkIdentity = {
  linkIdentity?: (args: {
    provider: Provider
    options?: { redirectTo?: string }
  }) => Promise<{ data?: unknown; error?: { message?: string } | null }>
}

export default function ConnectProviders({
  connected,
}: {
  connected: string[]
}) {
  const supabase = useMemo<SupabaseClient>(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )
  const { show } = useToast()

  const all: Provider[] = ['google', 'facebook', 'apple']
  const already = new Set(connected.map((p) => p.toLowerCase()))
  const remaining = all.filter((p) => !already.has(p))

  const [busy, setBusy] = useState<Provider | null>(null)
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://www.gift-huddle.com'

  if (remaining.length === 0) {
    return (
      <div className='text-sm opacity-70'>
        All providers are already connected.
      </div>
    )
  }

  const label = (p: Provider) => p[0].toUpperCase() + p.slice(1)
  const Icon = (p: Provider) =>
    p === 'google' ? (
      <GoogleIcon />
    ) : p === 'facebook' ? (
      <FacebookIcon />
    ) : (
      <AppleIcon />
    )

  const btnClass = (p: Provider, disabled: boolean) => {
    const base =
      'px-3 py-2 rounded-xl text-sm inline-flex items-center gap-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shadow'
    const dis = disabled ? ' opacity-80 cursor-not-allowed' : ''
    switch (p) {
      case 'google':
        return (
          base +
          ' bg-white border border-[#dadce0] text-[#1f1f1f] hover:bg-[#f8f9fa] focus-visible:ring-[#4285F4]' +
          dis
        )
      case 'facebook':
        return (
          base +
          ' bg-[#1877F2] text-white hover:bg-[#156fe0] focus-visible:ring-[#1877F2]' +
          dis
        )
      case 'apple':
        return (
          base +
          ' bg-black text-white hover:bg-[#111] focus-visible:ring-black' +
          dis
        )
    }
  }

  const connect = async (provider: Provider) => {
    setBusy(provider)
    const redirectTo = `${origin}/auth/callback?next=/account&linked=${provider}`
    try {
      const auth = supabase.auth as unknown as MaybeLinkIdentity
      const hasLinkIdentity = typeof auth.linkIdentity === 'function'

      show({
        type: 'info',
        title: `Starting ${label(provider)} linking…`,
        message:
          'If you are not redirected, please allow pop-ups and try again.',
      })

      if (hasLinkIdentity && auth.linkIdentity) {
        const { data, error } = await auth.linkIdentity({
          provider,
          options: { redirectTo },
        })
        if (error) {
          show({
            type: 'error',
            title: `Failed to start ${label(provider)} linking`,
            message: error.message || 'Unknown error from linkIdentity()',
          })
          await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo },
          })
          return
        }
        if (!data) {
          show({
            type: 'info',
            title: 'Redirecting…',
            message: `Continue in the ${label(provider)} window.`,
          })
        }
      } else {
        await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo },
        })
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : typeof e === 'string'
            ? e
            : 'Unexpected error during OAuth start'
      show({
        type: 'error',
        title: `Linking ${label(provider)} failed`,
        message,
      })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className='space-y-3'>
      <p className='text-sm opacity-80'>Connect another sign-in option:</p>
      <div className='flex flex-wrap gap-2'>
        {remaining.map((p) => (
          <button
            key={p}
            onClick={() => connect(p)}
            disabled={busy === p}
            className={btnClass(p, busy === p)}
            aria-label={`Connect ${label(p)}`}
          >
            <span className='shrink-0'>{Icon(p)}</span>
            {busy === p ? `Connecting ${label(p)}…` : `Connect ${label(p)}`}
          </button>
        ))}
      </div>
      <p className='text-xs opacity-60'>
        We’ll bring you back to this page after linking. If it fails, you’ll see
        a reason to help debug.
      </p>
    </div>
  )
}
