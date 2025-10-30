import { NextResponse } from 'next/server'
import { createServerClient, CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const next = url.searchParams.get('next') || '/account'

  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const code = url.searchParams.get('code') || ''
  if (!code) {
    const response = NextResponse.redirect(new URL(next, url), { status: 302 })
    return response
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const response = NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, url),
        { status: 302 }
      )
      return response
    }
  } catch {
    const response = NextResponse.redirect(
      new URL(`/login?error=callback-failed`, url),
      { status: 302 }
    )
    return response
  }

  const response = NextResponse.redirect(new URL(next, url), { status: 302 })
  return response
}
