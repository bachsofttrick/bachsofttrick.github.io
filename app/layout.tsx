import './styles/global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Brian Phan',
    template: '%s | Brian Phan',
  },
  description: 'This is Brian Phan portfolio.',
  openGraph: {
    title: 'Brian Phan',
    description: 'This is Brian Phan portfolio.',
    url: baseUrl,
    siteName: 'Brian Phan',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <meta name="msvalidate.01" content="D1474E050BE527719E98F0704865EEAE" />
      <GoogleAnalytics gaId="G-N3J3E2ME0X" />
      <body className="antialiased max-w-4xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
