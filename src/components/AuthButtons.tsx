'use client'
import { supabase } from '@/lib/supabaseClient'

type Provider = 'google' | 'apple' | 'facebook'
const providers: { id: Provider; label: string }[] = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'apple', label: 'Continue with Apple' },
  { id: 'facebook', label: 'Continue with Facebook' },
]

export default function AuthButtons() {
  async function signInWith(provider: Provider) {
    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
    if (error) alert(error.message)
  }
  return (
    <div className="grid gap-3 w-full max-w-sm">
      {providers.map(p => (
        <button key={p.id} onClick={() => signInWith(p.id)} className="btn-accent">
          {p.label}
        </button>
      ))}
    </div>
  )
}
