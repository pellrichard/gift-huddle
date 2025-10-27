'use client';
import React from 'react';

export default function LoginPage() {
  const go = (provider: 'google' | 'facebook') => {
    window.location.href = `/auth/signin?provider=${provider}`;
  };

  return (
    <main className="mx-auto max-w-xl py-16 px-6">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <div className="flex gap-3">
        <button className="rounded border px-4 py-2" onClick={() => go('google')}>Continue with Google</button>
        <button className="rounded border px-4 py-2" onClick={() => go('facebook')}>Continue with Facebook</button>
      </div>
    </main>
  );
}
