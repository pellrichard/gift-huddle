"use client";
import { useEffect } from "react";

type RouteError = Error & { digest?: string };

export default function GlobalError({
  error,
  reset,
}: {
  error: RouteError;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GH] Global error:", {
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
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
          {error?.digest ? (
            <code className="mb-6 rounded bg-gray-100 px-3 py-2 text-xs">
              {error.digest}
            </code>
          ) : null}
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
