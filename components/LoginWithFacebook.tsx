// components/LoginWithFacebook.tsx
"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginWithFacebook() {
  const supabase = createClientComponentClient();

  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          flowType: "pkce",
        },
        // Request only what you truly need:
        scopes: "public_profile,email,user_birthday"
      }
    });
  }

  return (
    <button onClick={login} className="btn">
      Continue with Facebook
    </button>
  );
}
