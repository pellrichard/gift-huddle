'use server';
import { revalidatePath } from 'next/cache';
import { createServerComponentClient } from '@/lib/supabase/server';

export async function updateProfile(formData: FormData) {
  const supabase = createServerComponentClient();
const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const full_name = (formData.get('full_name') || '').toString().trim() || null;
  const avatar_url = (formData.get('avatar_url') || '').toString().trim() || null;

  type ProfilesUpdate = import('@/lib/supabase/types').Database['public']['Tables']['profiles']['Update'];
const changes: ProfilesUpdate = { full_name, avatar_url };

const { error } = await supabase
    .from('profiles')
    .update(changes)
    .eq('id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/account');
}
