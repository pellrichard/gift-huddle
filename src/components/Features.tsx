function GiftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' width='28' height='28' {...props}>
      <path
        fill='#ec4899'
        d='M20 8h-3.2a3 3 0 0 0-2.8-4.2c-1.5 0-2.8 1-3.2 2.4-.4-1.4-1.7-2.4-3.2-2.4A3 3 0 0 0 4 8H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Zm-6-2a1 1 0 0 1 0 2h-2a1 1 0 0 1 0-2h2ZM8 6a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2h2Zm-2 6H4v-2h2v2Zm6 6H8v-6h4v6Zm6 0h-4v-6h4v6Zm2-8h-2v-2h2v2Z'
      />
    </svg>
  )
}
function DollarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' width='28' height='28' {...props}>
      <circle cx='12' cy='12' r='10' fill='#10b981' />
      <path
        d='M10 8c0-.6.4-1 1-1h2a2 2 0 1 1 0 4h-2a2 2 0 1 0 0 4h2c.6 0 1-.4 1-1'
        fill='none'
        stroke='#0f172a'
        strokeWidth='1.8'
      />
      <path d='M12 5v14' stroke='#0f172a' strokeWidth='1.8' />
    </svg>
  )
}
function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' width='28' height='28' {...props}>
      <path
        d='M12 22a2.5 2.5 0 0 0 2.4-2H9.6A2.5 2.5 0 0 0 12 22Z'
        fill='#f59e0b'
      />
      <path
        d='M19 17H5a2 2 0 0 1-2-2v-.5l1.3-1.3A7 7 0 0 0 6 8.3V8a6 6 0 0 1 12 0v.3a7 7 0 0 0 1.7 4.9L21 14.5V15a2 2 0 0 1-2 2Z'
        fill='#f59e0b'
      />
    </svg>
  )
}
function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' width='28' height='28' {...props}>
      <rect
        x='3'
        y='4'
        width='18'
        height='16'
        rx='3'
        fill='none'
        stroke='#ef4444'
        strokeWidth='1.8'
      />
      <path
        d='M7 8h10M7 12h10M7 16h7'
        stroke='#ef4444'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className='flex items-start gap-4'>
      <div>{icon}</div>
      <div>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <p className='text-gh-muted'>{children}</p>
      </div>
    </div>
  )
}

export default function Features() {
  return (
    <section id='features' className='mx-auto max-w-6xl px-4 py-10'>
      <div className='grid md:grid-cols-2 gap-10'>
        <Feature icon={<GiftIcon />} title='Build Gift Lists'>
          Invite your family and friends to join and create personalized gift
          lists.
        </Feature>
        <Feature icon={<DollarIcon />} title='Set Budgets'>
          Stay on budget by setting spending limits for each person and
          occasion.
        </Feature>
        <Feature icon={<BellIcon />} title='Get Reminders'>
          Receive timely reminders to buy gifts so you’re never caught off
          guard.
        </Feature>
        <Feature icon={<ListIcon />} title='Track Gifts'>
          See which gifts have been purchased and which are still available.
        </Feature>
      </div>
    </section>
  )
}
