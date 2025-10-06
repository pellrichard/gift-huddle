import { createServerComponentClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      width={20}
      height={20}
      alt=""
      className={className}
      referrerPolicy="no-referrer"
    />
  );
}

function FacebookF({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.313 0 2.686.235 2.686.235v2.97h-1.513c-1.49 0-1.954.93-1.954 1.887v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
      <path
        fill="#fff"
        d="M16.671 15.563l.532-3.49h-3.328V9.82c0-.957.464-1.887 1.954-1.887h1.513V4.964s-1.373-.235-2.686-.235c-2.741 0-4.533 1.66-4.533 4.668v2.718H7.078v3.49h3.047V24a12.08 12.08 0 0 0 1.875-.156v-8.281h2.671z"
      />
    </svg>
  );
}
export default async function LoginPage() {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/account");
  }
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <p className="mt-2 text-sm text-gray-600">Choose a provider:</p>
      <div className="mt-6 grid gap-3">
        <Link
          href="/auth/signin?provider=google"
          className="rounded border px-4 py-2 hover:bg-gray-50 inline-flex items-center gap-3"
        >
          <GoogleG className="h-5 w-5" />
          <span>Continue with Google</span>
        </Link>
        <Link
          href="/auth/signin?provider=facebook"
          className="rounded border px-4 py-2 hover:bg-gray-50 inline-flex items-center gap-3"
        >
          <FacebookF className="h-5 w-5" />
          <span>Continue with Facebook</span>
        </Link>
      </div>
    </section>
  );
}
