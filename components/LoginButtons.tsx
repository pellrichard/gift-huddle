// components/LoginButtons.tsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginButtons() {
  const supabase = createClientComponentClient();

  async function loginWithFacebook() {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          flowType: "pkce"
        }
      }
    });
  }

  return (
    <button onClick={loginWithFacebook} className="btn">
      Continue with Facebook
    </button>
  );
}
