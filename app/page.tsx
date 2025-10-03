import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export default async function HomePage() {
  try {
    const supabase = createServerComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      redirect("/account");
    }
  } catch {
    // If auth check fails, continue to render the public page.
  }

  // Keep a minimal public landing so we don't break existing content structure;
  // your existing sections will still render via nested routes or components.
  return null;
}
