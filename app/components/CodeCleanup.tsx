'use client'
import { useEffect } from 'react'

export default function CodeCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    // If the OAuth provider sent us back to / or any page with ?code=, bounce it to /auth/callback
    if (code) {
      window.location.replace(`/auth/callback?code=${encodeURIComponent(code)}`)
    }
  }, [])
  return null
}
