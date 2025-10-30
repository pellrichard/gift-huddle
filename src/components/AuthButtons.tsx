'use client'
import { supabase } from '@/lib/supabase/browser'

type Provider = 'google' | 'apple' | 'facebook'
const providers: { id: Provider; label: string }[] = [
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
]

export default function AuthButtons() {
  const login = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'https://www.gift-huddle.com/auth/oauth',
        ...({ flowType: 'pkce' } as { flowType: 'pkce' }),
      },
    })

    if (error) {
      console.error('OAuth login error:', error.message)
    } else if (data?.url) {
      window.location.href = data.url
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {providers.map(({ id, label }) => (
        <button key={id} onClick={() => login(id)}>
          Continue with {label}
        </button>
      ))}
    </div>
  )
}
