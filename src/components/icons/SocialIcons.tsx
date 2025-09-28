import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { title?: string };

export function FacebookIcon({ title = "Facebook", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label={title}
      role="img"
      {...props}
    >
      <path d="M22 12.06C22 6.477 17.523 2 11.94 2 6.357 2 1.88 6.477 1.88 12.06c0 4.998 3.657 9.14 8.438 9.94v-7.03H7.89v-2.91h2.43V9.845c0-2.4 1.43-3.726 3.621-3.726 1.049 0 2.145.187 2.145.187v2.36h-1.209c-1.192 0-1.564.74-1.564 1.5v1.8h2.664l-.426 2.91h-2.238V22c4.78-.8 8.438-4.942 8.438-9.94Z" />
    </svg>
  );
}

export function LinkedInIcon({ title = "LinkedIn", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label={title}
      role="img"
      {...props}
    >
      <path d="M20.451 20.451h-3.554v-5.569c0-1.328-.027-3.036-1.85-3.036-1.853 0-2.136 1.447-2.136 2.942v5.663H9.357V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.601 0 4.266 2.37 4.266 5.453v6.287zM5.337 7.433a2.063 2.063 0 1 1 0-4.127 2.063 2.063 0 0 1 0 4.127zM7.114 20.451H3.558V9h3.556v11.451z" />
    </svg>
  );
}
