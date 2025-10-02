'use client';

import React from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-sm opacity-80">If you contact support, include this code:</p>
          <code className="block p-3 rounded bg-neutral-100 text-neutral-800 border">{error.digest ?? "no-digest"}</code>
          <button
            className="px-4 py-2 rounded border"
            onClick={() => reset()}
            >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
