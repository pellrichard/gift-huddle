'use client'
import { supabase } from '@/lib/supabaseClient'
import type { Provider } from '@supabase/supabase-js'

export default function LoginProviderButtons({ providers, next }: { providers: Provider[]; next?: string }) {
  async function signInWith(provider: Provider) {
    const n = next && typeof next === 'string' ? next : '/account'
    const redirectTo = `${window.location.origin}/auth/callback${n ? `?next=${encodeURIComponent(n)}` : ''}`
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
    if (error) alert(error.message)
  }
  return (
    <div className="grid gap-3 w-full max-w-sm">
      {providers.map((p) => (
        <button key={p} onClick={() => signInWith(p)} className="btn-accent capitalize">
          Continue with {p}
        </button>
      ))}
    </div>
  )
}
