// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to Gift Huddle</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
        The smart way to create, share, and discover gift lists with friends and family.
      </p>
      <Link
        href="/login"
        className="rounded-xl bg-primary px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-primary/90"
      >
        Get Started
      </Link>
    </div>
  );
}
