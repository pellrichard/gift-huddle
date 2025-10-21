import { Suspense } from 'react';
import AuthCallbackClient from './AuthCallbackClient';

export default function Page() {
  return (
    <Suspense fallback={<p>Redirecting...</p>}>
      <AuthCallbackClient />
    </Suspense>
  );
}
