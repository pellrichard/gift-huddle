import Link from "next/link";
import { Instagram, Facebook, Twitter, Linkedin, Github } from "lucide-react";

const socials = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61581098625976", Icon: Facebook },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/gift-huddle", Icon: Linkedin },
];

const legalLinks = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold">Gift Huddle</p>
          <p className="text-sm text-gray-500">Plan, share, and celebrate together.</p>
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Gift Huddle. All rights reserved.</p>
          <nav className="flex gap-4 text-sm text-gray-500">
            {legalLinks.map(({ name, href }) => (
              <Link key={name} href={href} className="hover:text-gray-800">
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="flex items-center gap-4">
          {socials.map(({ name, href, Icon }) => (
            <Link
              key={name}
              href={href}
              aria-label={name}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
            >
              <Icon className="h-5 w-5 text-gray-700" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
