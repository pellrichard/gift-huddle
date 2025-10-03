// Simple server-side logger helper to provide consistent structured logs
// that show up in Vercel function logs.
export function logServerError(label: string, error: unknown, extra?: Record<string, unknown>) {
  const payload = {
    label,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...extra,
  };
  // eslint-disable-next-line no-console
  console.error("[GH] ServerError", payload);
}
