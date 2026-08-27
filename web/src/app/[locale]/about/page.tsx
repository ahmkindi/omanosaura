import Image from 'next/image'
import type { Metadata } from 'next'
import {
  getTranslations,
  setRequestLocale,
} from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('pageTitle'),
    description: t('desc'),
    alternates: localeAlternates('/about'),
  }
}

const CHAMPS = [1, 2, 3, 4, 5, 6] as const

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 py-12">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">{t('pageTitle')}</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">{t('desc')}</p>
        <Image
          src="/adventurer.svg"
          alt=""
          width={120}
          height={120}
          className="mx-auto"
        />
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {(['mission', 'vision'] as const).map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{t(`${key}.title`)}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {t(`${key}.desc`)}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-8">
        <h2 className="text-center text-3xl font-bold">{t('champs.title')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CHAMPS.map((i) => (
            <Card key={i} className="overflow-hidden pt-0">
              <div className="relative aspect-square">
                <Image
                  src={`/champs/${i}.jpeg`}
                  alt={t(`champs.${i}.name`)}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardContent className="space-y-1">
                <h3 className="font-semibold">{t(`champs.${i}.name`)}</h3>
                <p className="text-secondary text-sm font-medium">
                  {t(`champs.${i}.title`)}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t(`champs.${i}.desc`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
