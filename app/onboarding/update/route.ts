// app/onboarding/update/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse, type NextRequest } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'

type ProfilesUpsert = {
  id: string
  categories?: string[] | null
  preferred_shops?: string[] | null
}
type PgErr = {
  code?: string
  message?: string
  details?: string
  hint?: string
}

const CATEGORIES = ['tech', 'fashion', 'beauty', 'home', 'toys', 'sports']
const SHOPS = ['amazon', 'argos', 'johnlewis', 'etsy', 'nike', 'apple']

const rid = () =>
  Math.random().toString(36).slice(2) + '-' + Date.now().toString(36)
const isProd = process.env.NODE_ENV === 'production'

export async function POST(req: NextRequest) {
  const requestId = rid()
  const supabase = await createServerComponentClient()

  try {
    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession()

    if (sessionErr && !isProd) {
      console.error('[onboarding:update] session error', {
        requestId,
        sessionErr,
      })
    }

    if (!session) {
      if (!isProd) console.warn('[onboarding:update] no session', { requestId })
      return NextResponse.redirect(new URL(`/login?rid=${requestId}`, req.url))
    }

    const form = await req.formData()
    const rawCategories = form.getAll('categories').map(String)
    const rawPreferredShops = form.getAll('preferred_shops').map(String)

    const cats = rawCategories.filter((c) => CATEGORIES.includes(c))
    const shops = rawPreferredShops.filter((s) => SHOPS.includes(s))

    if (!isProd) {
      console.log('[onboarding:update] incoming', {
        requestId,
        userId: session.user.id,
        rawCategories,
        rawPreferredShops,
        filtered: { cats, shops },
      })
    }

    if (cats.length === 0 || shops.length === 0) {
      if (!isProd)
        console.warn('[onboarding:update] missing selections', { requestId })
      return NextResponse.redirect(
        new URL(`/onboarding?err=missing&rid=${requestId}`, req.url)
      )
    }

    const payload: ProfilesUpsert = {
      id: session.user.id,
      categories: cats,
      preferred_shops: shops,
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload as unknown as never, { onConflict: 'id' })
      .select('id')
      .single()

    if (error) {
      const pe = error as PgErr
      console.error('[onboarding:update] upsert error', {
        requestId,
        code: pe.code,
        message: pe.message,
        details: pe.details,
        hint: pe.hint,
      })

      const url = new URL('/onboarding', req.url)
      url.searchParams.set('err', pe.code || 'upsert_failed')
      if (pe.message) url.searchParams.set('msg', pe.message)
      url.searchParams.set('rid', requestId)
      return NextResponse.redirect(url)
    }

    if (!isProd)
      console.log('[onboarding:update] success', {
        requestId,
        userId: session.user.id,
        data,
      })
    return NextResponse.redirect(
      new URL(`/account?saved=1&rid=${requestId}`, req.url)
    )
  } catch (e: unknown) {
    const ex = e as { name?: string; message?: string; stack?: string }
    console.error('[onboarding:update] exception', {
      requestId,
      name: ex?.name,
      message: ex?.message,
      stack: ex?.stack,
    })
    const url = new URL('/onboarding', req.url)
    url.searchParams.set('err', 'exception')
    if (ex?.message) url.searchParams.set('msg', ex.message)
    url.searchParams.set('rid', requestId)
    return NextResponse.redirect(url)
  }
}
