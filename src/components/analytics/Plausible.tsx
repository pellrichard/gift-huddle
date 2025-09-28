'use client';

import Script from 'next/script';

export default function Plausible() {
  if (!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) return null;
  return (
    <Script
      defer
      data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
