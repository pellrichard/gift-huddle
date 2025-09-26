"use client";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/app`;

  const loginWith = async (provider: "google" | "apple" | "facebook") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo }, // Supabase will send users back here
    });
  };

  return (
    <div className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sign in to Gift Huddle</h1>
      <button className="w-full rounded-xl p-3 shadow" onClick={() => loginWith("google")}>Continue with Google</button>
      <button className="w-full rounded-xl p-3 shadow" onClick={() => loginWith("apple")}>Continue with Apple</button>
      <button className="w-full rounded-xl p-3 shadow" onClick={() => loginWith("facebook")}>Continue with Facebook</button>

      {/* Email sign in as a fallback */}
      {/* (You can add a magic-link flow or email+password form here) */}
    </div>
  );
}
