'use server';

import { revalidatePath } from 'next/cache';
import { createServerComponentClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type DB = Database;
type Insert = DB['public']['Tables']['profiles']['Insert'];

export type ProfileForEdit = {
  full_name: string | null;
  dob: string | null;
  dob_show_year: boolean | null;
  notify_mobile: boolean | null;
  notify_email: boolean | null;
  unsubscribe_all: boolean | null;
  preferred_currency: string | null;
  avatar_url: string | null;
  email: string | null;
};

// Helpers (no `any`)
function pick(obj: Record<string, unknown> | null | undefined, key: string): unknown {
  return obj && typeof obj === 'object' && key in obj
    ? (obj as Record<string, unknown>)[key]
    : undefined;
}
const toStr = (v: unknown): string | null =>
  typeof v === 'string' ? v : v == null ? null : String(v);
const toBool = (v: unknown): boolean | null =>
  typeof v === 'boolean' ? v : v == null ? null : Boolean(v);

/** Load profile for the edit modal; tolerant to full_name vs display_name in generated types. */
export async function getProfileForEdit(): Promise<{ ok: true; data: ProfileForEdit } | { ok: false; error: string }> {
  const supabase = createServerComponentClient() as unknown as SupabaseClient<DB>;

  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { ok: false, error: authErr.message };
  if (!auth?.user) return { ok: false, error: 'Not authenticated' };

  // Use * to avoid compile-time column mismatch; normalize afterwards.
  const { data: row, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', auth.user.id)
    .maybeSingle();

  if (error && error.message && !error.message.includes('Results contain 0 rows')) {
    return { ok: false, error: error.message };
  }

  const r = (row ?? null) as Record<string, unknown> | null;

  const normalized: ProfileForEdit = {
    full_name: toStr(pick(r, 'full_name')) ?? toStr(pick(r, 'display_name')),
    dob: toStr(pick(r, 'dob')),
    dob_show_year: toBool(pick(r, 'dob_show_year')) ?? true,
    notify_mobile: toBool(pick(r, 'notify_mobile')) ?? false,
    notify_email: toBool(pick(r, 'notify_email')) ?? true,
    unsubscribe_all: toBool(pick(r, 'unsubscribe_all')) ?? false,
    preferred_currency: toStr(pick(r, 'preferred_currency')) ?? 'GBP',
    avatar_url: toStr(pick(r, 'avatar_url')),
    email: auth.user.email ?? null,
  };

  return { ok: true, data: normalized };
}

/** Save edits; creates profile row if missing (UPSERT). */
export async function saveProfile(data: {
  full_name?: string | null;
  dob?: string | null;
  dob_show_year?: boolean | null;
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
    dob_show_year: data.dob_show_year ?? null,
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
