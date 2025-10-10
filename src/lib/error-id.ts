export function newErrorId(prefix = "E7"): string {
  const rnd = Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
  return `${rnd}@${prefix}`;
}
export function logWithId(ctx: string, err: unknown, code?: string): string {
  const id = code ?? newErrorId();
  console.error(`[${id}] ${ctx}:`, err);
  return id;
}
