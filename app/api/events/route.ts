import { NextRequest, NextResponse } from 'next/server'
import { logWithId } from '@/lib/error-id'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import type { Database } from '@/supabase/types'

type EventsInsert = Database['public']['Tables']['events']['Insert']
type Currency = Database['public']['Enums']['currency_code']

export async function POST(req: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const allowed: Currency[] = ['USD', 'GBP', 'EUR']
    const budget_input_currency: Currency | undefined = allowed.includes(
      body?.budget_input_currency
    )
      ? (body.budget_input_currency as Currency)
      : undefined

    const payload: EventsInsert = {
      // required
      title: String(body.title ?? ''),
      event_date: String(body.event_date),
      user_id: user.id,
      // optionals that exist in schema
      event_type:
        typeof body.event_type === 'string' ? body.event_type : undefined,
      timezone: typeof body.timezone === 'string' ? body.timezone : undefined,
      notes: typeof body.notes === 'string' ? body.notes : undefined,
      recurrence:
        typeof body.recurrence === 'string' ? body.recurrence : undefined,
      active_round:
        typeof body.active_round === 'number' ? body.active_round : undefined,
      budget_input_currency,
      budget_usd_cents:
        typeof body.budget_usd_cents === 'number'
          ? body.budget_usd_cents
          : undefined,
    }

    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select('*')
      .single()

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    const code = logWithId('/api/events POST', e)
    return NextResponse.json(
      { error: 'Something went wrong', code },
      { status: 500, headers: { 'x-error-id': code } }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
    if (from) query = query.gte('event_date', from)
    if (to) query = query.lte('event_date', to)

    const { data, error } = await query
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 200 })
  } catch (e) {
    const code = logWithId('/api/events GET', e)
    return NextResponse.json(
      { error: 'Something went wrong', code },
      { status: 500, headers: { 'x-error-id': code } }
    )
  }
}
