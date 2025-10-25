'use client';
import PKCEDebugButton from './PKCEDebugButton';

export default function LoginPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Gift Huddle Login (Verified PKCE)</h1>
      <PKCEDebugButton />
    </main>
  );
}
