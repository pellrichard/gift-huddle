import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

type EventRow = { id: string; title: string; date: string }

// If you already have a shared supabase client, import it instead.
const supabase = createClient('', '')

export default function EventsSection() {
  const [events, setEvents] = useState<EventRow[]>([])

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (!error && data) setEvents(data)
  }, []) // supabase is module-scoped; do not include in deps per lint hint

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents]) // no supabase.auth dep

  const today = useMemo(() => new Date(), []) // memoize to satisfy deps rule

  const upcoming = useMemo(
    () => events.filter((e) => new Date(e.date) >= today),
    [events, today]
  )

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {upcoming.map((event) => (
          <li key={event.id}>
            {event.title} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  )
}
