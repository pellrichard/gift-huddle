'use client'
import React from 'react'

export default function LoginButtons() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <form action='/auth/signin' method='GET'>
        <input type='hidden' name='provider' value='google' />
        <button type='submit'>Login with Google</button>
      </form>
      <form action='/auth/signin' method='GET'>
        <input type='hidden' name='provider' value='facebook' />
        <button type='submit'>Login with Facebook</button>
      </form>
    </div>
  )
}
