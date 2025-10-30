'use client'
import { supabase } from '@/lib/supabase/browser'

type PKCEOptions = { flowType: 'pkce' }

export default function PKCEDebugButton() {
  const login = async () => {
    console.log('[PKCE] Starting Supabase login with delay...')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.gift-huddle.com/auth/oauth',
        ...({ flowType: 'pkce' } as PKCEOptions),
      },
    })

    if (error) {
      console.error('[PKCE] Login error:', error.message)
      return
    }

    // Delay before redirect to ensure verifier is stored
    console.log('[PKCE] Storing code_verifier. Redirecting in 100ms...')
    setTimeout(() => {
      if (data?.url) {
        window.location.href = data.url
      } else {
        console.warn('[PKCE] No redirect URL returned.')
      }
    }, 100)
  }

  return <button onClick={login}>Start OAuth (with PKCE delay)</button>
}
