import Link from "next/link";

export const runtime = "nodejs";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <p className="mt-2 text-sm text-gray-600">Choose a provider:</p>
      <div className="mt-6 grid gap-3">
        <Link
          href="/auth/signin?provider=google"
          className="rounded border px-4 py-2 text-center hover:bg-gray-50"
        >
          Continue with Google
        </Link>
        <Link
          href="/auth/signin?provider=facebook"
          className="rounded border px-4 py-2 text-center hover:bg-gray-50"
        >
          Continue with Facebook
        </Link>
      </div>
    </section>
  );
}
