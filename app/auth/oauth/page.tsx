'use client';
import { useEffect, useState } from 'react';

export default function OAuthDebugPage() {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const messages: string[] = [];

    const currentUrl = window.location.href;
    const search = window.location.search;
    const query = new URLSearchParams(search);
    const code = query.get('code');
    const error = query.get('error');

    messages.push('[OAuthDebug] URL:', currentUrl);
    messages.push('[OAuthDebug] Query:', search);
    messages.push('[OAuthDebug] Code param:', code ?? '❌ null');
    messages.push('[OAuthDebug] Error param:', error ?? 'none');
    messages.push('[OAuthDebug] document.cookie:', document.cookie);
    messages.push('[OAuthDebug] LocalStorage code_verifier:', localStorage.getItem('sb-code-verifier') ?? '❌ null');

    setLog(messages);
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>🔍 OAuth Redirect Debug</h1>
      <p>This page logs the full redirect state after OAuth.</p>
      <ul style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#eee', padding: 12 }}>
        {log.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </main>
  );
}
