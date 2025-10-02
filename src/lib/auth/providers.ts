// src/lib/auth/providers.ts
import type { Provider } from "@supabase/supabase-js";

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

function truthy(v: string | undefined): boolean {
  if (!v) return false;
  const s = v.toLowerCase();
  return s === "1" || s === "true" || s === "on" || s === "yes";
}

/**
 * Reads NEXT_PUBLIC_AUTH_<PROVIDER>=1 style flags and returns enabled list.
 * Example: NEXT_PUBLIC_AUTH_GOOGLE=1
 */
export function getEnabledProviders(): Provider[] {
  const enabled: Provider[] = [];
  for (const p of CANDIDATES) {
    const key = `NEXT_PUBLIC_AUTH_${p.toUpperCase()}` as const;
    // @ts-expect-error - dynamic key from process.env
    const val: string | undefined = process.env[key];
    if (truthy(val)) enabled.push(p);
  }
  return enabled;
}

export type { Provider };
