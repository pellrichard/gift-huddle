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
  const [clientCookies, setClientCookies] = React.useState<DebugCookie[]>([])
  const [server, setServer] = React.useState<State>(null)

  React.useEffect(() => {
    // Client-side cookies (shallow preview)
    try {
      const entries = document.cookie
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .map((pair) => {
          const idx = pair.indexOf('=')
          const name = idx >= 0 ? pair.slice(0, idx) : pair
          const raw = idx >= 0 ? pair.slice(idx + 1) : ''
          const value = raw && raw.length > 6 ? `${raw.slice(0, 6)}…(${raw.length})` : raw
          return { name, value }
        })
      setClientCookies(entries)
    } catch (e) {
      setClientCookies([{ name: 'error', value: String(e) }])
    }

    // Server-side/session info
    fetch('/api/_debug/auth')
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text().catch(() => '')
          throw new Error(`HTTP ${r.status} ${body}`.trim())
        }
        return r.json() as Promise<DebugPayload>
      })
      .then((data) => setServer(data))
      .catch((err) => setServer({ error: String(err) }))
  }, [])

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
