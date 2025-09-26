import Link from 'next/link'

type Variant = 'brand' | 'outline' | 'ghost'
type Size = 'sm' | 'md'

const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/profile.php?id=61581098625976'
const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/gift-huddle'

const base = 'inline-flex items-center gap-2 rounded-xl transition px-3 py-2'

const styleByVariant: Record<Variant, string> = {
  brand: 'bg-[var(--gh-accent)] text-[var(--gh-accent-fg)] hover:bg-[var(--gh-accent-hover)]',
  outline: 'border border-[color:var(--gh-accent)] text-[color:var(--gh-accent)] hover:bg-[var(--gh-accent-soft)]',
  ghost: 'text-gh-ink/70 hover:text-gh-ink hover:bg-black/5'
}

const sizeByVariant: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base'
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.7c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2H15c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z"/>
    </svg>
  )
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.65-1.84 3.39-1.84 3.63 0 4.3 2.39 4.3 5.49v6.24zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>
    </svg>
  )
}

export default function SocialButtons({
  variant = 'brand',
  size = 'sm'
}: {
  variant?: Variant
  size?: Size
}) {
  const classes = (v: Variant) => [base, styleByVariant[v], sizeByVariant[size]].join(' ')
  return (
    <div className="flex items-center gap-2">
      <Link className={classes(variant)} href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Gift Huddle on Facebook">
        <FacebookIcon /> <span className="hidden sm:inline">Facebook</span>
      </Link>
      <Link className={classes(variant)} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Gift Huddle on LinkedIn">
        <LinkedInIcon /> <span className="hidden sm:inline">LinkedIn</span>
      </Link>
    </div>
  )
}
