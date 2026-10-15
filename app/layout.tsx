import './styles/global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { GoogleAnalytics } from '@next/third-parties/google'

const siteDescription = 'Brian Phan portfolio and blog: software engineering, AI projects, cooking, life, and photography.'
const ogImage = `${baseUrl}/images/about/portrait.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Brian Phan',
    template: '%s | Brian Phan',
  },
  description: siteDescription,
  keywords: ['Brian Phan', 'software engineer', 'OregonFlora', 'AI projects', 'blog', 'portfolio'],
  authors: [{ name: 'Brian Phan', url: baseUrl }],
  creator: 'Brian Phan',
  alternates: {
    canonical: baseUrl,
    types: {
      'application/rss+xml': `${baseUrl}/rss.xml`,
    },
  },
  openGraph: {
    title: 'Brian Phan',
    description: siteDescription,
    url: baseUrl,
    siteName: 'Brian Phan',
    locale: 'en_US',
    type: 'website',
    images: [{ url: ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brian Phan',
    description: siteDescription,
    images: [ogImage],
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
  verification: {
    other: {
      'msvalidate.01': 'D1474E050BE527719E98F0704865EEAE',
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Brian Phan',
    url: baseUrl,
    jobTitle: 'Software Engineer',
  }

  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <GoogleAnalytics gaId="G-N3J3E2ME0X" />
      <body className="antialiased max-w-4xl mx-4 mt-8 lg:mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
