import { NextResponse } from 'next/server'
import { createServerClient, CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

const PROVIDERS = new Set(['google', 'facebook'])

export async function GET(request: Request) {
  const url = new URL(request.url)
  const provider = (url.searchParams.get('provider') || '').toLowerCase()
  if (!PROVIDERS.has(provider)) {
    return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
  }

  const redirectTo = `${url.origin}/auth/callback?next=/account`

  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (cookieStore as any).get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(cookieStore as any).set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(cookieStore as any).set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'facebook',
    options: {
      redirectTo,
      queryParams:
        provider === 'google'
          ? { prompt: 'select_account consent' }
          : undefined,
    },
  })

  if (error || !data?.url) {
    console.error('OAuth init failed:', error?.message)
    return NextResponse.json(
      { error: error?.message || 'OAuth init failed' },
      { status: 500 }
    )
  }

  return NextResponse.redirect(data.url, { status: 302 })
}
