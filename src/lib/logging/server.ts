export function logServerError(label: string, error: unknown, extra?: Record<string, unknown>) {
  const payload = {
    label,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...extra,
  };
  console.error("[GH] ServerError", payload);
}
