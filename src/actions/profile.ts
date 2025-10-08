
'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createServerComponentClient } from '@/lib/supabase/server';

// ---------- Minimal types (no external DB generics, no `any`) ----------

// Input shape from the Edit Profile UI
export type SaveProfileInput = {
  full_name?: string | null;
  dob?: string | null;
  show_dob_year?: boolean | null;
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  preferred_currency?: string | null;
  avatar_url?: string | null;
  email?: string | null;
};

// What we read/write on the 'profiles' table
type ProfilesRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_currency: string | null;
  dob?: string | null;
  dob_show_year?: boolean | null;
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  email?: string | null;
};

// Narrow facade for the parts of the Supabase client we use
type AuthUser = { id: string; email?: string | null; user_metadata?: Record<string, unknown> };
type AuthModule = {
  getUser(): Promise<{ data: { user: AuthUser | null }; error: { message: string } | null }>;
};
type ProfilesFrom = {
  select(columns: string): {
    eq(column: 'id', value: string): {
      maybeSingle(): Promise<{ data: ProfilesRow | null; error: { message: string } | null }>
    }
  },
  upsert(values: ProfilesRow | ProfilesRow[], options?: {
    onConflict?: string;
    ignoreDuplicates?: boolean;
    count?: 'exact' | 'planned' | 'estimated';
    defaultToNull?: boolean;
  }): Promise<{ data?: unknown; error: { message: string } | null }>,
  update(values: Partial<ProfilesRow>): {
    eq(column: 'id', value: string): Promise<{ data?: unknown; error: { message: string } | null }>
  },
};
type ProfilesClient = {
  from(table: 'profiles'): ProfilesFrom;
  auth: AuthModule;
};

// ---------- Currency helpers ----------

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

export async function defaultCurrencyFromRequest(): Promise<string> {
  try {
    // headers() typing can differ; handle both sync and async returns
    const maybe = headers() as unknown;
    let h: Headers;
    if (typeof (maybe as Headers).get === 'function') {
      h = maybe as Headers;
    } else {
      h = await (maybe as Promise<Headers>);
    }

    const vercelCountry = (
      h.get('x-vercel-ip-country') ||
      h.get('x-country') ||
      h.get('cf-ipcountry') ||
      ''
    ).toUpperCase();

    if (vercelCountry && COUNTRY_TO_CURRENCY[vercelCountry]) {
      return vercelCountry === 'GB' ? 'GBP' : COUNTRY_TO_CURRENCY[vercelCountry];
    }

    const acceptLang = h.get('accept-language') || '';
    const region = parseRegionFromAcceptLanguage(acceptLang);
    if (region && COUNTRY_TO_CURRENCY[region]) {
      return region === 'GB' ? 'GBP' : COUNTRY_TO_CURRENCY[region];
    }
  } catch (e) {
    console.log('[profile] defaultCurrencyFromRequest error', e);
  }
  // UK launch default
  return 'GBP';
}

// ---------- Core actions ----------

function supabaseClient(): ProfilesClient {
  // Cast once to our narrow facade (no `any` is used)
  return createServerComponentClient() as unknown as ProfilesClient;
}

export async function bootstrapProfileFromAuth() {
  const supabase = supabaseClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { ok: false as const, error: authErr.message };
  if (!user) return { ok: false as const, error: 'Not authenticated' };

  const { data: existing, error: selErr } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, preferred_currency, dob')
    .eq('id', user.id)
    .maybeSingle();
  if (selErr) return { ok: false as const, error: selErr.message };

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName =
    (typeof meta['full_name'] === 'string' && meta['full_name']) ||
    (typeof meta['name'] === 'string' && meta['name']) ||
    (typeof meta['user_name'] === 'string' && meta['user_name']) ||
    user.email ||
    null;

  const avatarUrl =
    (typeof meta['avatar_url'] === 'string' && meta['avatar_url']) ||
    (typeof meta['picture'] === 'string' && meta['picture']) ||
    null;

  const defCcy = await defaultCurrencyFromRequest();

  if (!existing) {
    const insertRow: ProfilesRow = {
      id: user.id,
      display_name: displayName ?? null,
      avatar_url: avatarUrl ?? null,
      preferred_currency: defCcy,
    };
    const { error: insErr } = await supabase
      .from('profiles')
      .upsert(insertRow, { onConflict: 'id' });
    if (insErr) return { ok: false as const, error: insErr.message };
    revalidatePath('/account');
    return { ok: true as const };
  }

  const patch: Partial<ProfilesRow> = {};
  if (!existing.display_name && displayName) patch.display_name = displayName;
  if (!existing.avatar_url && avatarUrl) patch.avatar_url = avatarUrl;
  if (!existing.preferred_currency) patch.preferred_currency = defCcy;

  if (Object.keys(patch).length > 0) {
    const { error: updErr } = await supabase.from('profiles').update(patch).eq('id', user.id);
    if (updErr) return { ok: false as const, error: updErr.message };
    revalidatePath('/account');
  }

  return { ok: true as const };
}

export async function getProfileForEdit() {
  const supabase = supabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fallbackName =
    (typeof meta['full_name'] === 'string' && meta['full_name']) ||
    (typeof meta['name'] === 'string' && meta['name']) ||
    (typeof meta['user_name'] === 'string' && meta['user_name']) ||
    user.email ||
    null;
  const fallbackAvatar =
    (typeof meta['avatar_url'] === 'string' && meta['avatar_url']) ||
    (typeof meta['picture'] === 'string' && meta['picture']) ||
    null;

  return row
    ? { ...row, display_name: row.display_name ?? (fallbackName as string | null), avatar_url: row.avatar_url ?? (fallbackAvatar as string | null) }
    : null;
}

export async function saveProfile(input: SaveProfileInput) {
  const supabase = supabaseClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { ok: false as const, error: authErr.message };
  if (!user) return { ok: false as const, error: 'Not authenticated' };

  const updates: Partial<ProfilesRow> = {
    display_name: (input.full_name ?? null) as string | null,
    dob: (input.dob ?? null) as string | null,
    dob_show_year: (input.show_dob_year ?? null) as boolean | null,
    notify_mobile: (input.notify_mobile ?? null) as boolean | null,
    notify_email: (input.notify_email ?? null) as boolean | null,
    unsubscribe_all: (input.unsubscribe_all ?? null) as boolean | null,
    preferred_currency: (input.preferred_currency ?? null) as string | null,
    avatar_url: (input.avatar_url ?? null) as string | null,
    email: (input.email ?? null) as string | null,
  };

  const nameOk = typeof updates.display_name === 'string' && (updates.display_name as string).trim().length > 0;
  if (!nameOk || !updates.dob || !updates.preferred_currency) {
    return { ok: false as const, error: 'Please complete full name, date of birth and preferred currency.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath('/account');
  return { ok: true as const };
}
