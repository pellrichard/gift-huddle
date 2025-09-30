// Minimal, `no-explicit-any`-safe Database type.
// Replace with generated types when ready (see README below).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// Generic Database shape without `any`.
// Use `Record<string, unknown>` to satisfy eslint rules.
export type Database = Record<string, unknown>;
