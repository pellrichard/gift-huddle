'use client'
import { useEffect, useState } from 'react'

export default function SupabaseLogger() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'
    const ref = url.split('.')[0].replace('https://', '')
    const keys = Object.keys(localStorage).filter((k) =>
      k.includes('code-verifier')
    )

    setLogs([
      `[SupabaseLogger] Supabase URL: ${url}`,
      `[SupabaseLogger] Inferred project_ref: ${ref}`,
      `[SupabaseLogger] Current path: ${window.location.href}`,
      `[SupabaseLogger] code_verifier keys: ${keys.length ? keys.join(', ') : '❌ none found'}`,
      `[SupabaseLogger] document.cookie: ${document.cookie || '❌ empty'}`,
    ])
  }, [])

  return (
    <div
      style={{
        padding: 20,
        fontFamily: 'monospace',
        backgroundColor: '#f0f0f0',
      }}
    >
      <h2>🧪 Supabase Diagnostic Logger</h2>
      <ul>
        {logs.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
