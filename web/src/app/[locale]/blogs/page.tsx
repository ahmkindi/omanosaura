import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CalendarDays } from 'lucide-react'
import { SafeImage } from '@/components/safe-image'
import { localeAlternates } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { getBlogs } from '@/data/blogs'
import { pickLocalized } from '@/lib/localized'
import { Reveal } from '@/components/reveal'
import { Card, CardContent } from '@/components/ui/card'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return { title: t('sharing'), alternates: localeAlternates('/blogs') }
}

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, blogs] = await Promise.all([getTranslations('blog'), getBlogs()])

  const [featured, ...rest] = blogs

  return (
    <main className="bg-sand min-h-svh">
      <header className="bg-night relative overflow-hidden px-5 py-12 text-white sm:py-16">
        <div
          aria-hidden
          className="bg-secondary/10 absolute -top-20 -start-20 size-72 rounded-full blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-wadi mb-2 font-mono text-xs tracking-[0.3em] uppercase">
            Blog
          </p>
          <h1 className="font-display text-4xl font-bold uppercase sm:text-5xl">
            {t('sharing')}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-10 px-5 py-10">
        {featured && (
          <Reveal>
            <Link
              href={`/blogs/${featured.id}`}
              className="group grid overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl lg:grid-cols-[3fr_2fr]"
            >
              <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-80">
                <SafeImage
                  src={featured.photo}
                  alt={pickLocalized(featured, 'title', locale)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col justify-center gap-3 p-6 sm:p-9">
                <span className="text-secondary inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase">
                  <CalendarDays className="size-3.5" /> {featured.createdAt}
                </span>
                <h2 className="font-display text-2xl leading-tight font-bold sm:text-3xl">
                  {pickLocalized(featured, 'title', locale)}
                </h2>
                <p className="text-muted-foreground line-clamp-3">
                  {pickLocalized(featured, 'description', locale)}
                </p>
                <span className="text-secondary font-semibold">
                  {t('readMore')} →
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((blog, i) => (
            <Reveal key={blog.id} index={i % 6}>
              <Link href={`/blogs/${blog.id}`} className="group block h-full">
                <Card className="h-full overflow-hidden pt-0 transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SafeImage
                      src={blog.photo}
                      alt={pickLocalized(blog, 'title', locale)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="space-y-1.5">
                    <p className="text-muted-foreground font-mono text-xs">
                      {blog.createdAt}
                    </p>
                    <h2 className="font-display line-clamp-2 text-lg leading-snug font-bold">
                      {pickLocalized(blog, 'title', locale)}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {pickLocalized(blog, 'description', locale)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
        {blogs.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">—</p>
        )}
      </div>
    </main>
  )
}
