import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Gift Huddle',
  description: 'Gift lists that friends can actually use.',
  icons: {
    icon: '/brand/gift-huddle-favicon.svg',
    shortcut: '/brand/gift-huddle-favicon.svg',
    apple: '/brand/gift-huddle-favicon.svg'
  },
  themeColor: '#EC4899'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gh-bg text-gh-ink">
        <Header />
        <main className="">{children}</main>
	<Footer />
      </body>
    </html>
  )
}
