'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  useEffect(() => {
    // Supabase handles token parsing automatically on return
    // We can just route the user to the homepage or profile
    const timer = setTimeout(() => router.replace('/'), 800)
    return () => clearTimeout(timer)
  }, [router])
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-gh-muted">Finishing sign in…</p>
    </div>
  )
}
