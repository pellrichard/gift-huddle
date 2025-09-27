import Link from "next/link";
import { Instagram, Facebook, Twitter, Linkedin, Github } from "lucide-react";

const socials = [
  { name: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { name: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { name: "X / Twitter", href: "https://twitter.com", Icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
  { name: "GitHub", href: "https://github.com", Icon: Github },
];

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold">Gift Huddle</p>
          <p className="text-sm text-gray-500">Plan, share, and celebrate together.</p>
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Gift Huddle. All rights reserved.</p>
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
