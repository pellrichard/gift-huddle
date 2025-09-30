"use client";
import React from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const onLogin = async (provider: "google" | "facebook" | "apple") => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>
      <div className="flex flex-col gap-3">
        <button onClick={() => onLogin("google")} className="rounded-lg bg-gray-900 px-4 py-2 text-white">Continue with Google</button>
        <button onClick={() => onLogin("facebook")} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Continue with Facebook</button>
        <button onClick={() => onLogin("apple")} className="rounded-lg bg-black px-4 py-2 text-white">Continue with Apple</button>
      </div>
    </div>
  );
}
