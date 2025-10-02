// src/lib/auth/providers.ts
import type { Provider } from "@supabase/supabase-js";

// Broad set supported by Supabase; we only show those explicitly enabled via env,
// and if none are enabled, we fall back to a safe default list.
const CANDIDATES: Provider[] = [
  "google",
  "apple",
  "facebook",
  "github",
  "gitlab",
  "bitbucket",
  "discord",
  "twitch",
  "twitter",
  "slack",
  "azure",
  "linkedin"
];

const DEFAULTS: Provider[] = ["google", "facebook", "github"];

function truthy(v: string | undefined): boolean {
  if (!v) return false;
  const s = v.toLowerCase();
  return s === "1" || s === "true" || s === "on" || s === "yes";
}

/**
 * Reads NEXT_PUBLIC_AUTH_<PROVIDER>=1 style flags and returns enabled list.
 * If none are set, returns DEFAULTS so login isn't empty.
 */
export function getEnabledProviders(): Provider[] {
  const enabled: Provider[] = [];
  const env: Record<string, string | undefined> = process.env as Record<string, string | undefined>;
  for (const p of CANDIDATES) {
    const key = `NEXT_PUBLIC_AUTH_${p.toUpperCase()}` as const;
    const val = env[key];
    if (truthy(val)) enabled.push(p);
  }
  return enabled.length > 0 ? enabled : DEFAULTS;
}

export type { Provider };
