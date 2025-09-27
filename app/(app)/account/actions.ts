// app/(app)/account/actions.ts
"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
// Use a relative import to avoid alias issues in tsconfig
import { profileSchema } from "../../../lib/validators/profile";

export async function updateProfileAction(formData: FormData) {
  const supabase = createServerActionClient({ cookies });

  const payload = {
    full_name: String(formData.get("full_name") || ""),
    email: String(formData.get("email") || ""),
    dob: (formData.get("dob") as string) || null, // yyyy-mm-dd or null
    hide_birth_year: formData.get("hide_birth_year") === "on",
    interests: (formData.getAll("interests") as string[]) ?? [],
    preferred_shops: (formData.getAll("preferred_shops") as string[]) ?? [],
  };

  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() };
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      dob: parsed.data.dob || null,
      hide_birth_year: parsed.data.hide_birth_year,
      interests: parsed.data.interests,
      preferred_shops: parsed.data.preferred_shops,
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
