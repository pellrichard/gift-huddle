// /src/app/api/waitlist/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email().max(320),
  name: z.string().max(120).optional().nullable(),
  // simple honeypot field to deter bots
  company: z.string().max(0).optional().or(z.literal('')),
})

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as unknown
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input' },
        { status: 400 }
      )
    }
    const { email, name } = parsed.data

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
    )

    const { error } = await supabase
      .from('waitlist_signups')
      .upsert({ email, name, source: 'coming-soon' }, { onConflict: 'email' })

    if (error) {
      // allow harmless duplicate upserts
      const dup = /duplicate key value/i.test(error.message)
      if (!dup) {
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    // don’t leak internals; just return a generic error
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
