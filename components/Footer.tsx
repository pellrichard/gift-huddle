import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-16">
      <div className="mx-auto max-w-7xl px-6 py-8 grid gap-6 md:grid-cols-2">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gift Huddle — All rights reserved.
        </p>
        <div className="flex items-center gap-4 md:justify-end">
          <Link
            aria-label="Gift Huddle on Facebook"
            href="https://www.facebook.com/profile.php?id=61581098625976"
            target="_blank"
            className="hover:underline text-sm"
          >
            Facebook
          </Link>
          <Link
            aria-label="Gift Huddle on LinkedIn"
            href="https://www.linkedin.com/company/gift-huddle"
            target="_blank"
            className="hover:underline text-sm"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
