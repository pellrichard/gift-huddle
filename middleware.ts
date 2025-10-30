import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required!'
    )
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value
      },
      set(name, value, options) {
        req.cookies.set({ name, value, ...options })
        res.cookies.set({ name, value, ...options })
      },
      remove(name, options) {
        req.cookies.set({ name, value: '', ...options })
        res.cookies.set({ name, value: '', ...options })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/account')) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect_to', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/account'],
}
