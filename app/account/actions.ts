import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

/**
 * Public types consumed by `PreferencesForm.tsx`
 */
export type NotifyChannel = "email" | "sms" | "push" | "none";

export type PreferencesPayload = {
  preferred_currency?: string | null;
  notify_channel?: NotifyChannel | null;
  // Accept either string[] or { [key: string]: boolean } from the form
  categories?: string[] | Record<string, boolean> | null;
  // Optional extras some forms may send
  budget_monthly?: number | null;
  sizes?: { clothing: string | null; shoes: string | null } | null;
  preferred_shops?: string[] | null;
};

type ProfilesUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type ActionResult = { ok: boolean; message?: string };

/**
 * Merge the PreferencesPayload onto the profiles table.
 * You can pass a partial payload; only provided fields will be updated.
 */
export async function savePreferences(patch: PreferencesPayload): Promise<ActionResult> {
  try {
    const supabase = supabaseServer();

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) return { ok: false, message: "Not authenticated" };

    // Normalize categories
    let categoriesArray: string[] | undefined;
    if (Array.isArray(patch.categories)) {
      categoriesArray = patch.categories;
    } else if (patch.categories && typeof patch.categories === "object") {
      categoriesArray = Object.entries(patch.categories)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k);
    }

    // Start with fields common across schemas
    const update: ProfilesUpdate = {
      preferred_currency: patch.preferred_currency ?? undefined,
      notify_channel: patch.notify_channel ?? undefined,
    } as ProfilesUpdate;

    // Optionally apply fields only if they exist in your generated types
    const dyn = update as unknown as Record<string, unknown>;

    if ("categories" in ({} as ProfilesUpdate)) {
      dyn["categories"] = categoriesArray ?? undefined;
    }
    if ("preferred_shops" in ({} as ProfilesUpdate)) {
      dyn["preferred_shops"] = patch.preferred_shops ?? undefined;
    }
    if ("budget_monthly" in ({} as ProfilesUpdate)) {
      dyn["budget_monthly"] = patch.budget_monthly ?? undefined;
    }
    if ("sizes" in ({} as ProfilesUpdate)) {
      dyn["sizes"] = patch.sizes ?? undefined;
    }

    const { error } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", user.id);

    if (error) return { ok: false, message: error.message ?? "Failed to save" };

    return { ok: true, message: "Saved" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save";
    return { ok: false, message: msg };
  }
}

/**
 * Back-compat action used by older callers.
 */
export async function updateProfile(patch: ProfilesUpdate): Promise<ActionResult> {
  try {
    const supabase = supabaseServer();

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) return { ok: false, message: "Not authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id);

    if (error) return { ok: false, message: error.message ?? "Failed to save" };

    return { ok: true, message: "Saved" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save";
    return { ok: false, message: msg };
  }
}
