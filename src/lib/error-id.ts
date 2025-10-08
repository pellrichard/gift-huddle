export function newErrorId(prefix = "E7"): string {
  // 8-digit pseudo-random plus suffix (matches "12345678@E7" style)
  const rnd = Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
  return `${rnd}@${prefix}`;
}
export function logWithId(ctx: string, err: unknown, code?: string): string {
  const id = code ?? newErrorId();
  // eslint-disable-next-line no-console
  console.error(`[${id}] ${ctx}:`, err);
  return id;
}
