export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

type FxUpdaterSuccess = {
  ok: true
  base: string
  effective_date: string
  updated_count: number
  codes: number
}

type FxUpdaterError = {
  ok: false
  error: string
}

type FxUpdaterResponse = FxUpdaterSuccess | FxUpdaterError

async function triggerFxUpdate(reason: string) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as
    | string
    | undefined
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

  if (!SUPABASE_URL) {
    return NextResponse.json(
      { ok: false, error: 'Missing NEXT_PUBLIC_SUPABASE_URL' },
      { status: 500 }
    )
  }

  const fnUrl = `${SUPABASE_URL}/functions/v1/fx_updater`

  const res = await fetch(fnUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${SERVICE ?? ANON ?? ''}`,
      ...(ANON ? { apikey: ANON } : {}),
    },
    body: JSON.stringify({ reason, ts: new Date().toISOString() }),
  })

  const text = await res.text().catch(() => '')
  let parsed: unknown = undefined
  try {
    parsed = JSON.parse(text)
  } catch {
    // keep as text if not JSON
  }

  if (!res.ok) {
    const errMsg =
      typeof parsed === 'object' && parsed !== null && 'error' in parsed
        ? String((parsed as { error?: unknown }).error ?? '')
        : text || 'Function failed'

    return NextResponse.json(
      { ok: false, status: res.status, error: errMsg },
      { status: 502 }
    )
  }

  // Pass-through: if JSON, return as-is (narrow to expected type where possible)
  if (typeof parsed === 'object' && parsed !== null && 'ok' in parsed) {
    return NextResponse.json(parsed as FxUpdaterResponse)
  }

  // Fallback when function returned plain text
  return NextResponse.json({ ok: true, data: text })
}

export async function POST(req: Request) {
  const bodyUnknown = await req.json().catch(() => ({}) as unknown)
  const reason =
    typeof (bodyUnknown as { reason?: unknown })?.reason === 'string'
      ? String((bodyUnknown as { reason?: unknown }).reason)
      : 'api/fx/update'
  return triggerFxUpdate(reason)
}

export async function GET() {
  return triggerFxUpdate('manual')
}
