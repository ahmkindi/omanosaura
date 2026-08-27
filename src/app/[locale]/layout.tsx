import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Arabic,
} from 'next/font/google'
import { Suspense } from 'react'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { LoginDialog } from '@/components/layout/login-dialog'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css'

const ibmPlex = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-ibm-plex',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
})

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
})

const SITE_DESCRIPTION =
  'Adventure and experiences across Oman — trips, hikes, camps, and team days. We plan, you make memories.'

export const metadata: Metadata = {
  metadataBase: new URL('https://omanosaura.com'),
  title: {
    default: 'Omanosaura — Adventure & Experiences in Oman',
    template: '%s | Omanosaura',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'Omanosaura',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Omanosaura', statusBarStyle: 'black-translucent' },
  openGraph: {
    type: 'website',
    siteName: 'Omanosaura',
    title: 'Omanosaura — Adventure & Experiences in Oman',
    description: SITE_DESCRIPTION,
    url: 'https://omanosaura.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omanosaura — Adventure & Experiences in Oman',
    description: SITE_DESCRIPTION,
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${ibmPlex.variable} ${bricolage.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider>
          <div className="flex min-h-svh flex-col pb-16 md:pb-0">
            <Navbar />
            <div className="bg-sand flex-1">{children}</div>
            <Footer />
          </div>
          <Suspense>
            <BottomNav />
            <LoginDialog />
          </Suspense>
          <Toaster position="top-center" />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
