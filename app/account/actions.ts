'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase/server';

export type NotifyChannel = 'email' | 'push' | 'none' | null;

export type Sizes = {
  clothing?: string | null;
  shoes?: string | null;
} | null;

export type Interests = Record<string, boolean>;

export type Categories = {
  interests: Interests;
  budget_monthly: number | null;
  sizes: Sizes;
};

export type PreferencesPayload = {
  preferred_currency?: string | null;
  notify_channel?: NotifyChannel;
  /** interests only (checkbox booleans) */
  categories?: Interests;
  budget_monthly?: number | null;
  sizes?: { clothing?: string | null; shoes?: string | null } | null;
};

/** Minimal typing for the `profiles` table */
type ProfilesRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  preferred_currency: string | null;
  notify_channel: 'email' | 'push' | 'none' | null;
  categories: Categories | null;
  updated_at: string | null;
};

type ProfileUpdate = {
  preferred_currency: string | null;
  notify_channel: NotifyChannel;
  categories: Categories;
  updated_at: string;
};

export async function savePreferences(payload: PreferencesPayload) {
  const supabase = createServerSupabase();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, message: 'Not authenticated' };
  }

  const categories: Categories = {
    interests: payload.categories ?? {},
    budget_monthly: payload.budget_monthly ?? null,
    sizes: payload.sizes ?? null,
  };

  const update: ProfileUpdate = {
    preferred_currency: payload.preferred_currency ?? null,
    notify_channel: payload.notify_channel ?? null,
    categories,
    updated_at: new Date().toISOString(),
  };

  // Cast the update to the table's Partial row type so supabase-js is happy
  const patch: Partial<ProfilesRow> = update;

  const { error } = await supabase
    .from<ProfilesRow>('profiles')
    .update(patch)
    .eq('id', user.id);

  if (error) {
    return { ok: false as const, message: error.message };
  }

  revalidatePath('/account');
  return { ok: true as const };
}
