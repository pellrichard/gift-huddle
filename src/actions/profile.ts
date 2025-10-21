'use server';
/* eslint-disable */

import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { defaultCurrencyFromAcceptLanguage } from '@/lib/locale';

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  dob?: string | null;
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  preferred_currency?: string | null;
};

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
        setAll(toSet) {
          try { toSet.forEach(({ name, value, options }) => cookieStore.set({ name, value, ...options })); } catch {}
        },
      },
    }
  );
}

export async function upsertProfileFromAuth() {
  const supabase = await getServerClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { ok: false, reason: 'no-user', needsOnboarding: false };

  const h = await headers();
  const acceptLang = h.get('accept-language');
  const preferred_currency = defaultCurrencyFromAcceptLanguage(acceptLang);

  const full_name =
    (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
    (user.email ? String(user.email).split('@')[0] : null);

  const avatar_url =
    (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) ||
    null;

  const { data: existing } = await supabase
    .from('profiles')
    .select('id, dob, full_name, email, avatar_url, preferred_currency, notify_mobile, notify_email')
    .eq('id', user.id)
    .maybeSingle();

  const base: Profile = {
    id: user.id,
    full_name,
    email: user.email ?? null,
    avatar_url,
    preferred_currency
  };

  let patch: Record<string, any> = { ...base, updated_at: new Date().toISOString() };

  if (!existing) {
    patch.notify_mobile = true;
    patch.notify_email = true;
  } else {
    if (existing.notify_mobile == null) patch.notify_mobile = true;
    if (existing.notify_email == null) patch.notify_email = true;
    if (!existing.preferred_currency && preferred_currency) patch.preferred_currency = preferred_currency;
    if (!existing.full_name && full_name) patch.full_name = full_name;
    if (!existing.email && user.email) patch.email = user.email;
    if (!existing.avatar_url && avatar_url) patch.avatar_url = avatar_url;
  }

  const { error: upErr } = await supabase.from('profiles').upsert(patch, { onConflict: 'id' });
  if (upErr) return { ok: false, reason: 'profiles-upsert', error: upErr.message, needsOnboarding: false };

  const publicRow = {
    id: user.id,
    full_name: patch.full_name ?? full_name,
    email: patch.email ?? user.email ?? null,
    avatar_url: patch.avatar_url ?? avatar_url,
    updated_at: new Date().toISOString(),
  };
  await supabase.from('profiles_public').upsert(publicRow, { onConflict: 'id' });

  const { data: after } = await supabase
    .from('profiles')
    .select('dob')
    .eq('id', user.id)
    .maybeSingle();

  const needsOnboarding = !after || !after.dob;
  return { ok: true, needsOnboarding };
}

export async function ensureProfileForRequest() {
  return upsertProfileFromAuth();
}

export async function getProfileForEdit() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('full_name, dob, show_dob_year, notify_mobile, notify_email, unsubscribe_all, preferred_currency, avatar_url, email')
    .eq('id', user.id)
    .maybeSingle();
  return data ?? null;
}

export async function saveProfile(input: FormData | Record<string, any>) {
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

  if (!patch.preferred_currency) {
    const h = await headers();
    patch.preferred_currency = defaultCurrencyFromAcceptLanguage(h.get('accept-language'));
  }

  patch.updated_at = new Date().toISOString();
  const { error } = await supabase.from('profiles').update(patch).eq('id', user.id);
  if (error) return { ok: false, reason: 'update-error', error: error.message };
  return { ok: true };
}

export async function bootstrapProfileFromAuth() {
  return upsertProfileFromAuth();
}
