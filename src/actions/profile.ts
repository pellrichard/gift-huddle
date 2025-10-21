'use server';
/* eslint-disable */

import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { defaultCurrencyFromAcceptLanguage } from '@/lib/locale';

/** Build a server-side Supabase client wired to Next.js cookies */
async function getServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            );
          } catch { /* ignore */ }
        },
      },
    }
  );
}

/**
 * Ensure a profile row exists for the current authenticated user.
 * - Creates on first login (idempotent)
 * - Backfills missing full_name, email, avatar_url
 * - Defaults preferred_currency using Accept-Language (fallback GBP)
 */
export async function ensureProfileForRequest() {
  const supabase = await getServerClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { ok: false, reason: 'no-user', error: userErr?.message };
  }

  const acceptLang = (await headers()).get('accept-language');
  const preferred_currency = defaultCurrencyFromAcceptLanguage(acceptLang);

  const full_name =
    (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
    (user.email ? String(user.email).split('@')[0] : null);

  const avatar_url =
    (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) ||
    null;

  const { data: existing, error: selErr } = await supabase
    .from('profiles')
    .select('id, full_name, email, preferred_currency, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (selErr && selErr.code !== 'PGRST116') {
    return { ok: false, reason: 'select-error', error: selErr.message };
  }

  if (!existing) {
    const insert = {
      id: user.id,
      full_name,
      email: user.email,
      preferred_currency,
      avatar_url,
      updated_at: new Date().toISOString(),
    };
    const { error: insErr } = await supabase.from('profiles').insert(insert);
    if (insErr) return { ok: false, reason: 'insert-error', error: insErr.message };
    return { ok: true, created: true };
  }

  const patch: Record<string, unknown> = {};
  if (!existing.full_name && full_name) patch.full_name = full_name;
  if (!existing.email && user.email) patch.email = user.email;
  if (!existing.preferred_currency && preferred_currency) patch.preferred_currency = preferred_currency;
  if (!existing.avatar_url && avatar_url) patch.avatar_url = avatar_url;

  if (Object.keys(patch).length === 0) return { ok: true, created: false, updated: false };

  patch.updated_at = new Date().toISOString();
  const { error: updErr } = await supabase.from('profiles').update(patch).eq('id', user.id);
  if (updErr) return { ok: false, reason: 'update-error', error: updErr.message };
  return { ok: true, created: false, updated: true };
}

/** Ensure profile exists and return the profile row for editing */
export async function getProfileForEdit() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  await ensureProfileForRequest();
  const { data } = await supabase
    .from('profiles')
    .select('full_name, dob, show_dob_year, notify_mobile, notify_email, unsubscribe_all, preferred_currency, avatar_url, email')
    .eq('id', user.id)
    .maybeSingle();
  return data ?? null;
}

/** Bootstrap hook: simply ensure the profile exists */
export async function bootstrapProfileFromAuth() {
  return ensureProfileForRequest();
}

/**
 * Server Action to update the user's profile from a form or object.
 * Can be called from Client Components.
 */
export async function saveProfile(input: FormData | {
  full_name?: string | null;
  dob?: string | null;
  show_dob_year?: boolean | null;
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  preferred_currency?: string | null;
  avatar_url?: string | null;
}) {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'no-user' };

  let patch: any = {};
  if (typeof FormData !== 'undefined' && input instanceof FormData) {
    patch.full_name = (input.get('full_name') as string) ?? null;
    patch.dob = (input.get('dob') as string) ?? null;
    patch.show_dob_year = (input.get('show_dob_year') as string) === 'on' ? true : (input.get('show_dob_year') as any) ?? null;
    patch.notify_mobile = (input.get('notify_mobile') as string) === 'on' ? true : (input.get('notify_mobile') as any) ?? null;
    patch.notify_email = (input.get('notify_email') as string) === 'on' ? true : (input.get('notify_email') as any) ?? null;
    patch.unsubscribe_all = (input.get('unsubscribe_all') as string) === 'on' ? true : (input.get('unsubscribe_all') as any) ?? null;
    patch.preferred_currency = (input.get('preferred_currency') as string) ?? null;
    patch.avatar_url = (input.get('avatar_url') as string) ?? null;
  } else {
    const obj = input as any;
    patch = {
      full_name: obj.full_name ?? null,
      dob: obj.dob ?? null,
      show_dob_year: obj.show_dob_year ?? null,
      notify_mobile: obj.notify_mobile ?? null,
      notify_email: obj.notify_email ?? null,
      unsubscribe_all: obj.unsubscribe_all ?? null,
      preferred_currency: obj.preferred_currency ?? null,
      avatar_url: obj.avatar_url ?? null,
    };
  }

  // If preferred_currency missing, infer from Accept-Language (fallback GBP)
  if (!patch.preferred_currency) {
    patch.preferred_currency = defaultCurrencyFromAcceptLanguage((await headers()).get('accept-language'));
  }

  patch.updated_at = new Date().toISOString();
  const { error } = await supabase.from('profiles').update(patch).eq('id', user.id);
  if (error) return { ok: false, reason: 'update-error', error: error.message };
  return { ok: true };
}
