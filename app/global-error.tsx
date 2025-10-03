"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[GH] Global error:", {
      message: error?.message,
      stack: error?.stack,
      digest: (error as any)?.digest,
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-600 mb-4">
            Please try again. If you contact support, include this code:
          </p>
          { (error as any)?.digest ? (
            <code className="mb-6 rounded bg-gray-100 px-3 py-2 text-xs">
              {(error as any).digest}
            </code>
          ) : null }
          <button
            onClick={() => reset()}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
