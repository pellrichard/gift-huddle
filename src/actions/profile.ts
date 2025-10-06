'use server';

import { revalidatePath } from 'next/cache';
import { createServerComponentClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

import { headers } from 'next/headers';

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  GB: 'GBP', IE: 'EUR', FR: 'EUR', DE: 'EUR', ES: 'EUR', PT: 'EUR', IT: 'EUR',
  NL: 'EUR', BE: 'EUR', LU: 'EUR', AT: 'EUR', FI: 'EUR', GR: 'EUR', CY: 'EUR',
  MT: 'EUR', SK: 'EUR', SI: 'EUR', LV: 'EUR', LT: 'EUR', EE: 'EUR',
  US: 'USD', CA: 'CAD', AU: 'AUD', NZ: 'NZD',
  CH: 'CHF', NO: 'NOK', SE: 'SEK', DK: 'DKK',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF',
};
function parseRegionFromAcceptLanguage(al?: string | null): string | null {
  if (!al) return null;
  const m = /[-_](\w{2})(?:[;,]|$)/i.exec(al);
  return m ? m[1]!.toUpperCase() : null;
}
export function defaultCurrencyFromRequest(): string {
  try {
    const h = headers();
    const vercelCountry = (h.get('x-vercel-ip-country') || h.get('x-country') || h.get('cf-ipcountry') || '').toUpperCase();
    if (vercelCountry && COUNTRY_TO_CURRENCY[vercelCountry]) {
      return vercelCountry === 'GB' ? 'GBP' : COUNTRY_TO_CURRENCY[vercelCountry];
    }
    const acceptLang = h.get('accept-language') || '';
    const region = parseRegionFromAcceptLanguage(acceptLang);
    if (region && COUNTRY_TO_CURRENCY[region]) {
      return region === 'GB' ? 'GBP' : COUNTRY_TO_CURRENCY[region];
    }
  } catch {}
  return 'GBP';
}

type DB = Database;
type Insert = DB['public']['Tables']['profiles']['Insert'];

export type ProfileForEdit = {
  full_name: string | null;
  dob: string | null;
  show_dob_year: boolean | null;
  notify_mobile: boolean | null;
  notify_email: boolean | null;
  unsubscribe_all: boolean | null;
  preferred_currency: string | null;
  avatar_url: string | null;
  email: string | null;
};

// Helpers (no any)
function pick(obj: Record<string, unknown> | null | undefined, key: string): unknown {
  return obj && typeof obj === 'object' && key in obj
    ? (obj as Record<string, unknown>)[key]
    : undefined;
}
const toStr = (v: unknown): string | null =>
  typeof v === 'string' ? v : v == null ? null : String(v);
const toBool = (v: unknown): boolean | null =>
  typeof v === 'boolean' ? v : v == null ? null : Boolean(v);

function deriveNameAndAvatar(user: { email: string | null; user_metadata: Record<string, unknown> }): {
  full_name: string | null;
  avatar_url: string | null;
} {
  const m = user.user_metadata ?? {};
  const name =
    toStr(pick(m, 'full_name')) ||
    toStr(pick(m, 'name')) ||
    toStr(pick(m, 'user_name')) ||
    toStr(pick(m, 'preferred_username')) ||
    toStr(pick(m, 'nickname')) ||
    (user.email ? user.email.split('@')[0] : null);

  const avatar =
    toStr(pick(m, 'avatar_url')) ||
    toStr(pick(m, 'picture')) ||
    null;

  return { full_name: name, avatar_url: avatar };
}

/** Create/update the profiles row from the current auth user. */

export async function bootstrapProfileFromAuth() {
  const supabase = createServerComponentClient() as unknown as SupabaseClient<DB>;
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { ok: false as const, error: authErr.message };
  if (!user) return { ok: false as const, error: 'Not authenticated' };

  // Read minimal profile row
  const { data: existing, error: selErr } = await supabase
    .from('profiles')
    .select('id, preferred_currency')
    .eq('id', user.id)
    .maybeSingle();

  // Derive name/avatar from OAuth metadata
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName = typeof meta['full_name'] === 'string' ? meta['full_name'] as string
                    : typeof meta['name'] === 'string' ? meta['name'] as string
                    : typeof meta['user_name'] === 'string' ? meta['user_name'] as string
                    : user.email ?? null;
  const avatarUrl = typeof meta['avatar_url'] === 'string' ? meta['avatar_url'] as string
                  : typeof meta['picture'] === 'string' ? meta['picture'] as string
                  : null;

  const defCcy = defaultCurrencyFromRequest();

  if (!existing) {
    const insertRow: Insert = {
      id: user.id,
      full_name: displayName ?? null,
      avatar_url: avatarUrl ?? null,
      preferred_currency: defCcy,
    };
    const { error: insErr } = await supabase.from('profiles').upsert(insertRow, { onConflict: 'id' });
    if (insErr) return { ok: false as const, error: insErr.message };
    revalidatePath('/account');
    return { ok: true as const };
  }

  // Ensure currency is set at least
  if (!existing.preferred_currency) {
    await supabase.from('profiles').update({ preferred_currency: defCcy }).eq('id', user.id);
    revalidatePath('/account');
  }

  return { ok: true as const };
}


/** Load profile for the edit modal (tolerant to show_dob_year vs historical dob_show_year in types). */
export async function getProfileForEdit(): Promise<{ ok: true; data: ProfileForEdit } | { ok: false; error: string }> {
  const supabase = createServerComponentClient() as unknown as SupabaseClient<DB>;
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { ok: false, error: authErr.message };
  if (!auth?.user) return { ok: false, error: 'Not authenticated' };

  const userId = auth.user.id;
  const userEmail = auth.user.email ?? null;
  const userMeta: Record<string, unknown> = (auth.user as unknown as { user_metadata: Record<string, unknown> }).user_metadata ?? {};

  const { data: row, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error && error.message && !error.message.includes('Results contain 0 rows')) {
    return { ok: false, error: error.message };
  }

  const r = (row ?? null) as Record<string, unknown> | null;
  const data: ProfileForEdit = {
    full_name: toStr(pick(r, 'full_name')) ?? toStr(pick(r, 'display_name')),
    dob: toStr(pick(r, 'dob')),
    show_dob_year: toBool(pick(r, 'show_dob_year')) ?? toBool(pick(r, 'dob_show_year')) ?? true,
    notify_mobile: toBool(pick(r, 'notify_mobile')) ?? false,
    notify_email: toBool(pick(r, 'notify_email')) ?? true,
    unsubscribe_all: toBool(pick(r, 'unsubscribe_all')) ?? false,
    preferred_currency: toStr(pick(r, 'preferred_currency')) ?? 'GBP',
    avatar_url: toStr(pick(r, 'avatar_url')),
    email: userEmail,
  };

  // If row is missing or has no name, try to bootstrap once
  if (!row || !data.full_name) {
    const boot = await bootstrapProfileFromAuth();
    if (boot.ok) {
      const { data: row2 } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      const r2 = (row2 ?? null) as Record<string, unknown> | null;
      return {
        ok: true,
        data: {
          ...data,
          full_name: toStr(pick(r2, 'full_name')) ?? data.full_name,
          avatar_url: toStr(pick(r2, 'avatar_url')) ?? data.avatar_url,
        }
      };
    } else {
      // fallback to auth metadata
      const dm = deriveNameAndAvatar({ email: userEmail, user_metadata: userMeta });
      return {
        ok: true,
        data: {
          ...data,
          full_name: dm.full_name,
          avatar_url: dm.avatar_url,
        }
      };
    }
  }

  return { ok: true, data };
}

/** Save edits; writes show_dob_year (DB column) and not the legacy dob_show_year. */
export async function saveProfile(data: {
  full_name?: string | null;
  dob?: string | null;
  show_dob_year?: boolean | null;
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  preferred_currency?: string | null;
}) {
  const supabase = createServerComponentClient() as unknown as SupabaseClient<DB>;

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { ok: false as const, error: authErr.message };
  if (!user) return { ok: false as const, error: 'Not authenticated' };

  const upsertObj = {
    id: user.id,
    full_name: data.full_name ?? null,
    dob: data.dob ?? null,
    show_dob_year: data.show_dob_year ?? null,
    notify_mobile: data.notify_mobile ?? null,
    notify_email: data.notify_email ?? null,
    unsubscribe_all: data.unsubscribe_all ?? null,
    preferred_currency: data.preferred_currency ?? null,
  } as unknown as Insert;

  const { error } = await supabase
    .from('profiles')
    .upsert(upsertObj, { onConflict: 'id' })
    .select('id')
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/account');
  return { ok: true as const };
}
