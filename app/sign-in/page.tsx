'use client'
import AuthButtons from '@/components/AuthButtons'

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Sign in</h1>
      <p className="text-gh-muted mb-6">Choose a provider to continue.</p>
      <AuthButtons />
    </div>
  )
}
