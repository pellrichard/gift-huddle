export const metadata = {
  title: 'Features | Gift Huddle',
  description:
    'Wishlists, sharing, friend approvals, preferences, and reminders — all in one place.',
}

const Feature = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className='p-6 rounded-2xl border bg-white'>
    <h3 className='text-lg font-semibold'>{title}</h3>
    <p className='text-gray-600 mt-2'>{children}</p>
  </div>
)

export default function Page() {
  return (
    <main className='max-w-6xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold'>Features</h1>
      <div className='grid md:grid-cols-2 gap-6 mt-8'>
        <Feature title='Smart wishlists'>
          Build and organise lists for any occasion. Share with a private link.
        </Feature>
        <Feature title='Friend approvals'>
          Approve or decline connection requests to manage who can see your
          lists.
        </Feature>
        <Feature title='Personalised picks'>
          Tell us your categories and favourite shops to tailor suggestions.
        </Feature>
        <Feature title='Mark as ordered'>
          Friends can reserve purchases (requires sign in) to avoid duplicates.
        </Feature>
        <Feature title='Price awareness'>
          See recent price drops at a glance.
        </Feature>
        <Feature title='Privacy-first'>
          We store your data securely and never sell it.
        </Feature>
      </div>
    </main>
  )
}
