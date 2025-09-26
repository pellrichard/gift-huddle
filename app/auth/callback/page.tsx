'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  useEffect(() => {
    const t = setTimeout(() => router.replace('/'), 600)
    return () => clearTimeout(t)
  }, [router])
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-gh-muted">Finishing sign in…</p>
    </div>
  )
}
