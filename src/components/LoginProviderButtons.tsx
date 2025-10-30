'use client'
import { supabase } from '@/lib/supabase/browser'
import type { Provider } from '@supabase/supabase-js'

export default function LoginProviderButtons({
  providers,
  next,
}: {
  providers: Provider[]
  next?: string
}) {
  const login = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: next ?? 'https://www.gift-huddle.com/auth/oauth',
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
    <div>
      {providers.map((provider) => (
        <button key={provider} onClick={() => login(provider)}>
          Sign in with {provider}
        </button>
      ))}
    </div>
  )
}
