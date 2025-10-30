'use server'
/* eslint-disable */

import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { defaultCurrencyFromAcceptLanguage } from '@/lib/locale'

type Profile = {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  dob?: string | null
  notify_mobile?: boolean | null
  notify_email?: boolean | null
  unsubscribe_all?: boolean | null
  preferred_currency?: string | null
}

async function getServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(toSet) {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            )
          } catch {}
        },
      },
    }
  )
}

async function getAllowedCurrencies(supabase: any): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('fx_rates')
    .select('*')
    .limit(1000)
  if (error) return new Set(['GBP', 'EUR', 'USD'])
  const codes = new Set<string>()
  const candidates = [
    'code',
    'currency',
    'ccy',
    'symbol',
    'id',
    'base',
    'from',
    'quote',
  ]
  for (const row of data || []) {
    for (const key of candidates) {
      const v = (row as any)[key]
      if (typeof v === 'string' && /^[A-Z]{3}$/.test(v))
        codes.add(v.toUpperCase())
    }
  }
  if (codes.size === 0) {
    codes.add('GBP')
    codes.add('EUR')
    codes.add('USD')
  }
  return codes
}

function chooseAllowedCurrency(
  preferred: string | null | undefined,
  allowed: Set<string>
): string {
  const pick = (preferred || '').toUpperCase()
  if (pick && allowed.has(pick)) return pick
  if (allowed.has('GBP')) return 'GBP'
  if (allowed.has('EUR')) return 'EUR'
  if (allowed.has('USD')) return 'USD'
  const first = Array.from(allowed)[0]
  return typeof first === 'string' && first ? first : 'GBP'
}

const ISO_CURRENCY_NAMES: Record<string, string> = {
  GBP: 'British Pound',
  EUR: 'Euro',
  USD: 'US Dollar',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  NZD: 'New Zealand Dollar',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
  KRW: 'South Korean Won',
  INR: 'Indian Rupee',
  CHF: 'Swiss Franc',
  NOK: 'Norwegian Krone',
  SEK: 'Swedish Krona',
  DKK: 'Danish Krone',
  ISK: 'Icelandic Króna',
  ZAR: 'South African Rand',
  BRL: 'Brazilian Real',
  MXN: 'Mexican Peso',
  ARS: 'Argentine Peso',
}
function codeToLabel(code: string): string {
  return ISO_CURRENCY_NAMES[code]
    ? `${ISO_CURRENCY_NAMES[code]} (${code})`
    : code
}

/** Detailed currency list for UI with labels, constrained by fx_rates */
export async function listCurrenciesForUiDetailed(): Promise<
  Array<{ code: string; label: string }>
> {
  const supabase = await getServerClient()
  const allowed = await getAllowedCurrencies(supabase)
  const arr = Array.from(allowed).map((code) => ({
    code,
    label: codeToLabel(code),
  }))
  arr.sort((a, b) => a.label.localeCompare(b.label))
  return arr
}

/** Code-only list for UI (sorted), constrained by fx_rates */
export async function listCurrenciesForUi(): Promise<string[]> {
  const det = await listCurrenciesForUiDetailed()
  return det.map((d) => d.code)
}

/**
 * OAuth callback upsert:
 * - Upserts profiles (full_name, email, avatar_url, preferred_currency)
 * - Defaults notify_mobile/notify_email = true (insert or when missing)
 * - Upserts profiles_public (id, full_name, email, avatar_url)
 * - Returns needsOnboarding = true if dob is missing.
 */
export async function upsertProfileFromAuth() {
  const supabase = await getServerClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user)
    return { ok: false, reason: 'no-user', needsOnboarding: false }

  const h = await headers()
  const acceptLang = h.get('accept-language')
  const inferred = defaultCurrencyFromAcceptLanguage(acceptLang)
  const allowed = await getAllowedCurrencies(supabase)
  const preferred_currency = chooseAllowedCurrency(inferred, allowed)

  const full_name =
    (user.user_metadata &&
      (user.user_metadata.full_name || user.user_metadata.name)) ||
    (user.email ? String(user.email).split('@')[0] : null)

  const avatar_url =
    (user.user_metadata &&
      (user.user_metadata.avatar_url || user.user_metadata.picture)) ||
    null

  const { data: existing } = await supabase
    .from('profiles')
    .select(
      'id, dob, full_name, email, avatar_url, preferred_currency, notify_mobile, notify_email'
    )
    .eq('id', user.id)
    .maybeSingle()

  const base: Profile = {
    id: user.id,
    full_name,
    email: user.email ?? null,
    avatar_url,
    preferred_currency,
  }

  const patch: Record<string, any> = {
    ...base,
    updated_at: new Date().toISOString(),
  }

  if (!existing) {
    patch.notify_mobile = true
    patch.notify_email = true
  } else {
    if (existing.notify_mobile == null) patch.notify_mobile = true
    if (existing.notify_email == null) patch.notify_email = true
    if (!existing.preferred_currency && preferred_currency)
      patch.preferred_currency = preferred_currency
    if (!existing.full_name && full_name) patch.full_name = full_name
    if (!existing.email && user.email) patch.email = user.email
    if (!existing.avatar_url && avatar_url) patch.avatar_url = avatar_url
  }

  const { error: upErr } = await supabase
    .from('profiles')
    .upsert(patch, { onConflict: 'id' })
  if (upErr)
    return {
      ok: false,
      reason: 'profiles-upsert',
      error: upErr.message,
      needsOnboarding: false,
    }

  const publicRow = {
    id: user.id,
    full_name: patch.full_name ?? full_name,
    email: patch.email ?? user.email ?? null,
    avatar_url: patch.avatar_url ?? avatar_url,
    updated_at: new Date().toISOString(),
  }
  await supabase.from('profiles_public').upsert(publicRow, { onConflict: 'id' })

  const { data: after } = await supabase
    .from('profiles')
    .select('dob')
    .eq('id', user.id)
    .maybeSingle()

  const needsOnboarding = !after || !after.dob
  return { ok: true, needsOnboarding }
}

/** Back-compat aliases */
export async function ensureProfileForRequest() {
  return upsertProfileFromAuth()
}
export async function bootstrapProfileFromAuth() {
  return upsertProfileFromAuth()
}

/** Fetch profile for account page */
export async function getProfileForEdit() {
  const supabase = await getServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select(
      'full_name, dob, show_dob_year, notify_mobile, notify_email, unsubscribe_all, preferred_currency, avatar_url, email'
    )
    .eq('id', user.id)
    .maybeSingle()
  return data ?? null
}

/** Save profile updates (server action); validates currency via fx_rates */
export async function saveProfile(input: FormData | Record<string, any>) {
  const supabase = await getServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, reason: 'no-user' }

  let patch: any = {}
  if (typeof FormData !== 'undefined' && input instanceof FormData) {
    patch.full_name = (input.get('full_name') as string) ?? null
    patch.dob = (input.get('dob') as string) ?? null
    patch.show_dob_year =
      (input.get('show_dob_year') as string) === 'on'
        ? true
        : ((input.get('show_dob_year') as any) ?? null)
    patch.notify_mobile =
      (input.get('notify_mobile') as string) === 'on'
        ? true
        : ((input.get('notify_mobile') as any) ?? null)
    patch.notify_email =
      (input.get('notify_email') as string) === 'on'
        ? true
        : ((input.get('notify_email') as any) ?? null)
    patch.unsubscribe_all =
      (input.get('unsubscribe_all') as string) === 'on'
        ? true
        : ((input.get('unsubscribe_all') as any) ?? null)
    patch.preferred_currency =
      (input.get('preferred_currency') as string) ?? null
    patch.avatar_url = (input.get('avatar_url') as string) ?? null
  } else {
    const obj = input as any
    patch = {
      full_name: obj.full_name ?? null,
      dob: obj.dob ?? null,
      show_dob_year: obj.show_dob_year ?? null,
      notify_mobile: obj.notify_mobile ?? null,
      notify_email: obj.notify_email ?? null,
      unsubscribe_all: obj.unsubscribe_all ?? null,
      preferred_currency: obj.preferred_currency ?? null,
      avatar_url: obj.avatar_url ?? null,
    }
  }

  // Normalize currency to allowed set
  {
    const h = await headers()
    const inferred = defaultCurrencyFromAcceptLanguage(h.get('accept-language'))
    const allowed = await getAllowedCurrencies(supabase)
    patch.preferred_currency = chooseAllowedCurrency(
      patch.preferred_currency ?? inferred,
      allowed
    )
  }

  patch.updated_at = new Date().toISOString()
  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', user.id)
  if (error) return { ok: false, reason: 'update-error', error: error.message }
  return { ok: true }
}
