'use client'
import React from "react";
import { supabase } from "@/lib/supabaseClient";

type Provider = "google" | "facebook" | "apple";

const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.9 0-12.5-5.6-12.5-12.5S17.1 11 24 11c3.2 0 6.2 1.2 8.5 3.2l5.7-5.7C34.5 5 29.5 3 24 3 12 3 2.5 12.5 2.5 24S12 45 24 45c12 0 21.5-9.5 21.5-21.5 0-1.6-.2-2.7-.4-3z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16 19 13 24 13c3.2 0 6.2 1.2 8.5 3.2l5.7-5.7C34.5 5 29.5 3 24 3 15.5 3 8.2 7.8 4.6 14.2l1.7.5z"/>
    <path fill="#4CAF50" d="M24 45c5.4 0 10.4-2.1 14.1-5.5l-6.5-5.3C29.5 35.7 26.9 36.7 24 36.7c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C8.7 41.9 15.8 45 24 45z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.5-4.5 5.9l6.5 5.3c3.8-3.5 6.2-8.5 6.2-14.7 0-1.6-.2-2.7-.4-3z"/>
  </svg>
);

const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#1877F2" d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078V12.07h3.047V9.412c0-3.016 1.791-4.687 4.533-4.687 1.313 0 2.686.235 2.686.235v2.953h-1.514c-1.492 0-1.955.928-1.955 1.88v2.277h3.328l-.532 3.492h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    <path fill="#fff" d="M16.672 15.563l.531-3.492h-3.328v-2.277c0-.952.463-1.88 1.955-1.88h1.514V4.96s-1.373-.235-2.686-.235c-2.742 0-4.533 1.672-4.533 4.687v2.657H7.078v3.492h3.047V24h3.75v-8.437h2.797z"/>
  </svg>
);

const IconApple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#000" d="M16.365 1.43c0 1.14-.467 2.264-1.283 3.074-.846.836-2.066 1.49-3.24 1.4-.143-1.105.41-2.26 1.242-3.104.83-.856 2.22-1.467 3.28-1.37zM20.25 17.64c-.618 1.36-1.37 2.707-2.47 2.726-1.07.02-1.41-.68-2.64-.68-1.23 0-1.61.66-2.64.7-1.06.04-1.87-1.47-2.49-2.82-1.36-2.94-1.5-4.61-.66-5.89.95-1.44 2.58-1.61 2.93-1.63 1.2-.12 2.34.8 2.96.8.61 0 1.86-.98 3.15-.84.54.02 2.05.22 3.02 1.65-.08.05-1.8 1.04-1.78 3.07.03 2.44 2.14 3.25 2.16 3.26z"/>
  </svg>
);

export default function LoginButtons() {
  const handle = async (provider: Provider) => {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${origin}/auth/callback?next=/account` },
    });
  };

  const base =
    "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:shadow-sm active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-pink-500/30";
  const sizes = "w-auto";
  const variants = {
    google: "bg-white text-gray-900 border-gray-300",
    facebook: "bg-white text-gray-900 border-gray-300",
    apple: "bg-white text-gray-900 border-gray-300",
  } as const;

  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <button onClick={() => handle("google")} className={`${base} ${sizes} ${variants.google}`}>
        <IconGoogle /> <span>Continue with Google</span>
      </button>
      <button onClick={() => handle("facebook")} className={`${base} ${sizes} ${variants.facebook}`}>
        <IconFacebook /> <span>Continue with Facebook</span>
      </button>
      <button onClick={() => handle("apple")} className={`${base} ${sizes} ${variants.apple}`}>
        <IconApple /> <span>Continue with Apple</span>
      </button>
    </div>
  );
}
