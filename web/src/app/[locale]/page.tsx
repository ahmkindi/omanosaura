import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'
import { Users, Sparkles, ShieldCheck, Quote } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getProducts } from '@/data/products'
import { ProductCard } from '@/components/experiences/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    description: t('description'),
    alternates: localeAlternates(''),
  }
}

const WHY_US = [
  { icon: Users, title: 'whyUsTitle1', desc: 'whyUsDesc1' },
  { icon: Sparkles, title: 'whyUsTitle2', desc: 'whyUsDesc2' },
  { icon: ShieldCheck, title: 'whyUsTitle3', desc: 'whyUsDesc3' },
] as const

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tc, products] = await Promise.all([
    getTranslations('home'),
    getTranslations('common'),
    getProducts(),
  ])

  const featured = [...products]
    .sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount)
    .slice(0, 3)

  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/back-photo.jpg"
        >
          <source src="/homeVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6 px-4 text-center text-white">
          <h1 className="text-4xl font-bold sm:text-6xl">{t('omanSlogan')}</h1>
          <p className="text-lg opacity-90">{t('introText')}</p>
          <Button asChild size="lg" variant="secondary" className="text-base">
            <Link href="/experiences">{t('contactText')}</Link>
          </Button>
        </div>
      </section>

      {/* Featured experiences */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">{t('services')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/experiences">{tc('experiences')}</Link>
          </Button>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">{t('whyUs')}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <CardHeader className="items-center text-center">
                  <Icon className="text-secondary mx-auto mb-2 size-8" />
                  <CardTitle>{t(title)}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-center text-sm">
                  {t(desc)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tailored experience CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">{t('service.title')}</h2>
        <p className="text-muted-foreground mt-2">{t('service.desc')}</p>
        <Button asChild className="mt-6">
          <Link href="/contact">{tc('contact')}</Link>
        </Button>
      </section>

      {/* Testimonial */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-3xl space-y-4 px-4 text-center">
          <h2 className="text-2xl font-bold">{t('reviews')}</h2>
          <Quote className="mx-auto size-8 opacity-60" />
          <blockquote className="text-lg italic opacity-90">
            {t('reviewDesc')}
          </blockquote>
          <p className="font-semibold">
            {t('reviewName')}{' '}
            <span className="font-normal opacity-70">
              — {t('reviewNameDesc')}
            </span>
          </p>
        </div>
      </section>

      {/* Lizard mark */}
      <section className="flex justify-center py-12">
        <Image src="/lizard.svg" alt="Omanosaura" width={80} height={80} />
      </section>
    </main>
  )
}
