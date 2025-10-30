'use client'
import React from 'react'

export default function LoginButtons() {
  const handleLogin = (provider: 'google' | 'facebook') => {
    window.location.href = `/auth/signin?provider=${provider}`
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <button onClick={() => handleLogin('google')}>Login with Google</button>
      <button onClick={() => handleLogin('facebook')}>
        Login with Facebook
      </button>
    </div>
  )
}
