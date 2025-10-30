'use client'
import { useCallback } from 'react'
// @ts-expect-error: using internal Supabase helper
import { createPKCEVerifierChallengePair } from '@supabase/auth-js/dist/module/fetch/_pkce'

export default function ManualPKCELogin() {
  const login = useCallback(async () => {
    const { verifier, challenge } = await createPKCEVerifierChallengePair()

    sessionStorage.setItem('sb-code-verifier', verifier)
    console.log('[PKCE] Stored verifier in sessionStorage:', verifier)

    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split(
      '.'
    )[0].replace('https://', '')
    const redirectTo = encodeURIComponent(
      'https://www.gift-huddle.com/auth/oauth'
    )

    const authorizeUrl = `https://${projectRef}.supabase.co/auth/v1/authorize?provider=google&redirect_to=${redirectTo}&response_type=code&code_challenge=${challenge}&code_challenge_method=S256`

    // Use requestIdleCallback to ensure storage is flushed before redirect
    requestIdleCallback(
      () => {
        console.log('[PKCE] Redirecting to authorize URL:', authorizeUrl)
        window.location.href = authorizeUrl
      },
      { timeout: 500 }
    )
  }, [])

  return <button onClick={login}>Login via Stable PKCE (Idle-safe)</button>
}
