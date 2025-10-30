'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/browser'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const hasSession = !!data.session
      if (!hasSession) {
        router.replace('/login?error=unauthenticated')
      } else {
        setLoading(false)
      }
    })
  }, [router])

  if (loading) return <p>Checking authentication...</p>

  return <>{children}</>
}
