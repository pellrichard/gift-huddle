'use client'
import { useEffect, useState } from 'react'

export default function SupabaseRuntimeCheck() {
  const [output, setOutput] = useState<string[]>([])

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'N/A'
    const project = url.split('.')[0].replace('https://', '')
    const keys = Object.keys(localStorage).filter((k) =>
      k.includes('code-verifier')
    )
    const verifier = keys.map((k) => `${k} = ${localStorage.getItem(k)}`)

    setOutput([
      `[SupabaseRuntimeCheck] Supabase URL: ${url}`,
      `[SupabaseRuntimeCheck] Inferred project_ref: ${project}`,
      `[SupabaseRuntimeCheck] LocalStorage PKCE keys:`,
      ...verifier,
      `[SupabaseRuntimeCheck] document.cookie:`,
      document.cookie || '❌ empty',
    ])
  }, [])

  return (
    <div
      style={{ padding: 16, fontFamily: 'monospace', background: '#f8f8f8' }}
    >
      <h2>🧪 Supabase Runtime Check</h2>
      <ul>
        {output.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
