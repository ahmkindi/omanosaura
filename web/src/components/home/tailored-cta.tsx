'use client'

import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export function TailoredCta() {
  const t = useTranslations('home')
  const tc = useTranslations('common')

  return (
    <section className="bg-sand px-5 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-4xl">
        <div className="bg-night relative overflow-hidden rounded-3xl px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="bg-secondary/20 absolute -top-24 -end-24 size-64 rounded-full blur-3xl"
          />
          <div
            aria-hidden
            className="bg-wadi/15 absolute -bottom-24 -start-24 size-64 rounded-full blur-3xl"
          />
          <h2 className="font-display relative text-3xl font-bold uppercase sm:text-4xl">
            {t('service.title')}
          </h2>
          <p className="relative mt-3 text-white/70">{t('service.desc')}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-7 font-semibold"
            >
              <a
                href="https://wa.me/0096895598840"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-5" /> WhatsApp
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/30 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">{tc('contact')}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
