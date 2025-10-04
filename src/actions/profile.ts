'use server';

import { revalidatePath } from 'next/cache';
import { createServerComponentClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type DB = Database;
type Insert = DB['public']['Tables']['profiles']['Insert'];

export async function saveProfile(data: {
  display_name?: string | null;
  dob?: string | null;
  dob_show_year?: boolean | null;
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  preferred_currency?: string | null;
}) {
  // Use the project's server wrapper (already wired to cookies/headers) to avoid typing mismatch
  const supabase = createServerComponentClient() as unknown as SupabaseClient<DB>;

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr) return { ok: false as const, error: authErr.message };
  if (!user) return { ok: false as const, error: 'Not authenticated' };

  const upsertObj: Insert = {
    id: user.id,
    display_name: data.display_name ?? null,
    dob: data.dob ?? null,
    dob_show_year: data.dob_show_year ?? null,
    notify_mobile: data.notify_mobile ?? null,
    notify_email: data.notify_email ?? null,
    unsubscribe_all: data.unsubscribe_all ?? null,
    preferred_currency: data.preferred_currency ?? null,
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(upsertObj, { onConflict: 'id' })
    .select('id')
    .single();

  if (error) return { ok: false as const, error: error.message };

  revalidatePath('/account');
  return { ok: true as const };
}
