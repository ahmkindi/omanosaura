import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import { Suspense } from 'react'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { LoginDialog } from '@/components/layout/login-dialog'
import { Toaster } from '@/components/ui/sonner'
import '../globals.css'

const ibmPlex = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-ibm-plex',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://omanosaura.com'),
  title: {
    default: 'Omanosaura',
    template: '%s | Omanosaura',
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
      <body className={`${ibmPlex.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <div className="flex min-h-svh flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <Suspense>
            <LoginDialog />
          </Suspense>
          <Toaster position="bottom-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
