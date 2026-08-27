import Image from 'next/image'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/seo'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getBlogs } from '@/data/blogs'
import { pickLocalized } from '@/lib/localized'
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

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold">{t('sharing')}</h1>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.id}`}>
            <Card className="group h-full overflow-hidden pt-0 transition-shadow hover:shadow-lg">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={blog.photo}
                  alt={pickLocalized(blog, 'title', locale)}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="space-y-1.5">
                <h2 className="line-clamp-1 font-semibold">
                  {pickLocalized(blog, 'title', locale)}
                </h2>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {pickLocalized(blog, 'description', locale)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {blog.authorName} · {blog.createdAt}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {blogs.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">—</p>
      )}
    </main>
  )
}
