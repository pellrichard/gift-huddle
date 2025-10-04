'use server';
import { revalidatePath } from 'next/cache';
import { createServerComponentClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type DB = Database;
type Update = DB['public']['Tables']['profiles']['Update'];

export async function saveProfile(data: {
  display_name?: string | null;
  dob?: string | null;
  dob_show_year?: boolean | null;
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  preferred_currency?: string | null;
}) {
  const supabase = createServerComponentClient();
  const db = supabase as unknown as SupabaseClient<DB>;

  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const changes: Update = {
    display_name: data.display_name ?? null,
    dob: data.dob ?? null,
    dob_show_year: data.dob_show_year ?? null,
    notify_mobile: data.notify_mobile ?? null,
    notify_email: data.notify_email ?? null,
    unsubscribe_all: data.unsubscribe_all ?? null,
    preferred_currency: data.preferred_currency ?? null,
  };

  const { error } = await db
    .from('profiles')
    .update(changes)
    .eq('id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/account');
}
