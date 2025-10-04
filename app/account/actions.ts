'use server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createServerComponentClient } from '@/lib/supabase/server';

export async function updateProfile(formData: FormData) {
  const supabase = createServerComponentClient();
  type DB = import('@/lib/supabase/types').Database;
const db = (supabase as unknown as SupabaseClient<DB>);
const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const display_name = (formData.get('display_name') || '').toString().trim() || null;
  const avatar_url = (formData.get('avatar_url') || '').toString().trim() || null;

  type ProfilesUpdate = import('@/lib/supabase/types').Database['public']['Tables']['profiles']['Update'];
const changes: ProfilesUpdate = { display_name, avatar_url };

const { error } = await db
    .from('profiles')
    .update(changes)
    .eq('id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/account');
}
