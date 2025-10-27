'use client';
import React from 'react';
import Image from 'next/image';

type Provider = 'google' | 'facebook';

function ProviderButton({ provider, children }: { provider: Provider, children: React.ReactNode }) {
  const onClick = () => {
    window.location.href = `/auth/signin?provider=${provider}`;
  };
  const iconSrc = provider === 'google' ? '/brands/google.svg' : '/brands/facebook.svg';
  const label = provider === 'google' ? 'Continue with Google' : 'Continue with Facebook';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 border rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50 active:translate-y-px transition"
      aria-label={label}
    >
      <Image src={iconSrc} width={18} height={18} alt="" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md py-16 px-6">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <div className="flex flex-col gap-3">
        <ProviderButton provider="google">Continue with Google</ProviderButton>
        <ProviderButton provider="facebook">Continue with Facebook</ProviderButton>
      </div>
    </main>
  );
}
