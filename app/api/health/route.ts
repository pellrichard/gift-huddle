import { NextResponse } from 'next/server'
import { getMissingEnv } from '@/lib/utils/env'

export const runtime = 'nodejs'

export async function GET() {
  const missing = getMissingEnv()
  const status = missing.length === 0 ? 'ok' : 'degraded'
  return NextResponse.json(
    {
      status,
      missingEnv: missing,
      time: new Date().toISOString(),
    },
    { status: missing.length === 0 ? 200 : 500 }
  )
}
