import Link from "next/link";
import Image from "next/image";

export const runtime = "nodejs";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <p className="mt-2 text-sm text-gray-600">Choose a provider:</p>
      <div className="mt-6 grid gap-3">
        <Link
          href="/auth/signin?provider=google"
          className="rounded border px-4 py-2 hover:bg-gray-50 inline-flex items-center gap-3"
        >
          <Image
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            width={18}
            height={18}
            unoptimized
          />
          <span>Continue with Google</span>
        </Link>
        <Link
          href="/auth/signin?provider=facebook"
          className="rounded border px-4 py-2 hover:bg-gray-50 inline-flex items-center gap-3"
        >
          <Image
            src="https://www.facebook.com/images/fb_icon_325x325.png"
            alt="Facebook logo"
            width={18}
            height={18}
            unoptimized
          />
          <span>Continue with Facebook</span>
        </Link>
      </div>
    </section>
  );
}
