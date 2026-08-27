import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getBlog, getBlogIds } from '@/data/blogs'
import { routing } from '@/i18n/routing'
import { localeAlternates } from '@/lib/seo'
import { pickLocalized } from '@/lib/localized'
import { RichContent } from '@/components/rich-content'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const ids = await getBlogIds()
  return routing.locales.flatMap((locale) => ids.map((id) => ({ locale, id })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const [t, blog] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getBlog(id),
  ])
  if (!blog) return {}
  return {
    title: t('blogTitle', { title: pickLocalized(blog, 'title', locale) }),
    description: pickLocalized(blog, 'description', locale),
    openGraph: { images: [blog.photo] },
    alternates: localeAlternates(`/blogs/${encodeURIComponent(id)}`),
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const blog = await getBlog(id)
  if (!blog) notFound()

  const title = pickLocalized(blog, 'title', locale)

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground">
          {pickLocalized(blog, 'description', locale)}
        </p>
        <p className="text-muted-foreground text-sm">
          {blog.authorName} · {blog.createdAt}
        </p>
      </header>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <Image
          src={blog.photo}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>
      <RichContent html={pickLocalized(blog, 'page', locale)} />
    </main>
  )
}
