'use client'
import React from 'react'

type DebugCookie = { name: string; value: string }
type DebugPayload = {
  url: string
  session_present: boolean
  user_id: string | null
  access_token_len: number
  error: string | null
  cookies: DebugCookie[]
}

type State = DebugPayload | { error?: string } | null

export default function DebugAuthPage() {
  const [clientCookies, setClientCookies] = React.useState<string[]>([])
  const [server, setServer] = React.useState<State>(null)

  // Effect runs in all environments, but does nothing in production.
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    fetch('/api/_debug/auth', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: DebugPayload) => setServer(data))
      .catch(e => setServer({ error: String(e) }))

    try { setClientCookies(document.cookie.split(';').map(x => x.trim())) } catch {}
  }, [])

  if (process.env.NODE_ENV === 'production') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
        <p>Not available in production.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      <section className="mb-6">
        <h2 className="font-semibold">Client cookies</h2>
        <pre className="text-sm bg-gray-50 p-3 rounded">{JSON.stringify(clientCookies, null, 2)}</pre>
      </section>
      <section>
        <h2 className="font-semibold">Server-side (API)</h2>
        <pre className="text-sm bg-gray-50 p-3 rounded">{JSON.stringify(server, null, 2)}</pre>
      </section>
    </main>
  )
}
