import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/seo'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Camera, Mail, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('pageTitle'),
    description: t('desc'),
    alternates: localeAlternates('/contact'),
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <main className="mx-auto grid max-w-5xl gap-12 px-4 py-12 md:grid-cols-2">
      <section className="space-y-6">
        <h1 className="font-display text-4xl font-bold uppercase sm:text-5xl">{t('pageTitle')}</h1>
        <p className="text-muted-foreground">{t('desc')}</p>
        <div className="space-y-3 text-sm">
          <a
            href="mailto:admin@omanosaura.com"
            className="flex items-center gap-2 hover:underline"
          >
            <Mail className="text-secondary size-4" /> admin@omanosaura.com
          </a>
          <a
            href="https://wa.me/0096895598840"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <Phone className="text-secondary size-4" /> WhatsApp
          </a>
          <a
            href="https://www.instagram.com/omanosaura/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <Camera className="text-secondary size-4" /> Instagram
          </a>
        </div>
      </section>
      <section>
        <ContactForm />
      </section>
    </main>
  )
}
