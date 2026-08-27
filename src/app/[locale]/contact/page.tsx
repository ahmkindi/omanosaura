import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/seo'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowUpRight, Camera, Mail, MessageCircle } from 'lucide-react'
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

const CHANNELS = [
  {
    key: 'whatsapp',
    hintKey: 'whatsappHint',
    value: '+968 9559 8840',
    href: 'https://wa.me/0096895598840',
    icon: MessageCircle,
    primary: true,
  },
  {
    key: 'emailLabel',
    hintKey: 'emailHint',
    value: 'info@omanosaura.com',
    href: 'mailto:info@omanosaura.com',
    icon: Mail,
    primary: false,
  },
  {
    key: 'instagram',
    hintKey: 'instagramHint',
    value: '@omanosaura',
    href: 'https://www.instagram.com/omanosaura/',
    icon: Camera,
    primary: false,
  },
] as const

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <header className="max-w-2xl space-y-4">
        <p className="text-wadi font-mono text-xs tracking-[0.25em] uppercase">
          23.588°N 58.383°E · Muscat, Oman
        </p>
        <h1 className="font-display text-4xl font-bold uppercase sm:text-6xl">
          {t('headline')}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {t('desc')}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="bg-night flex flex-col rounded-3xl p-6 text-white sm:p-8">
          <div className="grow">
            {CHANNELS.map(({ key, hintKey, value, href, icon: Icon, primary }) => (
              <a
                key={key}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="group flex items-center gap-4 border-b border-white/10 py-5 first:pt-0 last:border-0"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full ${
                    primary
                      ? 'bg-wadi text-night'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 grow">
                  <span className="block font-semibold">{t(key)}</span>
                  <span className="block text-sm text-white/55">
                    {t(hintKey)}
                  </span>
                </span>
                <span className="hidden shrink-0 font-mono text-sm text-white/70 sm:block" dir="ltr">
                  {value}
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--color-wadi) rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </a>
            ))}
          </div>
          <p className="pt-6 font-mono text-[11px] tracking-wider text-white/40 uppercase">
            Omanosaura Adventures · License L2000917
          </p>
        </section>

        <section className="bg-card rounded-3xl border p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold uppercase">
            {t('formTitle')}
          </h2>
          <p className="text-muted-foreground mt-1 mb-6 text-sm">
            {t('formHint')}
          </p>
          <ContactForm />
        </section>
      </div>
    </main>
  )
}
