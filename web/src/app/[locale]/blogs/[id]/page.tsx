import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CalendarDays, Clock, UserRound } from 'lucide-react'
import { SafeImage } from '@/components/safe-image'
import { Link } from '@/i18n/navigation'
import { getBlog, getBlogIds } from '@/data/blogs'
import { routing } from '@/i18n/routing'
import { localeAlternates } from '@/lib/seo'
import { pickLocalized } from '@/lib/localized'
import { RichContent } from '@/components/rich-content'
import { ReadingProgress } from '@/components/blogs/progress-bar'

export const revalidate = 3600
export const dynamicParams = true

const BASE = 'https://omanosaura.com'

export async function generateStaticParams() {
  const ids = await getBlogIds()
  return routing.locales.flatMap((locale) => ids.map((id) => ({ locale, id })))
}

function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const blog = await getBlog(decodeURIComponent(id))
  if (!blog) return {}
  const title = pickLocalized(blog, 'title', locale)
  const description = pickLocalized(blog, 'description', locale)
  const path = `/blogs/${encodeURIComponent(blog.id)}`
  return {
    title,
    description,
    alternates: localeAlternates(path),
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${BASE}${locale === 'ar' ? '/ar' : ''}${path}`,
      images: [{ url: blog.photo }],
      publishedTime: blog.createdAt,
      authors: [blog.authorName],
      siteName: 'Omanosaura',
      locale: locale === 'ar' ? 'ar_OM' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [blog.photo],
    },
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const [t, blog] = await Promise.all([
    getTranslations('blog'),
    getBlog(decodeURIComponent(id)),
  ])
  if (!blog) notFound()

  const title = pickLocalized(blog, 'title', locale)
  const description = pickLocalized(blog, 'description', locale)
  const html = pickLocalized(blog, 'page', locale)
  const minutes = readingMinutes(html)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: [blog.photo],
    datePublished: blog.createdAt,
    author: { '@type': 'Person', name: blog.authorName },
    publisher: {
      '@type': 'Organization',
      name: 'Omanosaura',
      logo: { '@type': 'ImageObject', url: `${BASE}/main_logo.png` },
    },
    mainEntityOfPage: `${BASE}/blogs/${encodeURIComponent(blog.id)}`,
    inLanguage: locale === 'ar' ? 'ar' : 'en',
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />

      <article>
        <header className="bg-night px-5 py-12 text-white sm:py-16">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blogs"
              className="text-wadi font-mono text-xs tracking-[0.3em] uppercase hover:underline"
            >
              {t('sharing')}
            </Link>
            <h1 className="font-display mt-3 text-3xl leading-tight font-bold text-balance sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-white/70">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-4" /> {blog.authorName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                <time dateTime={blog.createdAt}>{blog.createdAt}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" /> {minutes}′
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5">
          <div className="relative -mt-0 aspect-[16/9] overflow-hidden rounded-2xl shadow-lg sm:-mt-8">
            <SafeImage
              src={blog.photo}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <div className="py-10">
            <RichContent html={html} />
          </div>
        </div>
      </article>
    </main>
  )
}
