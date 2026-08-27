import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { blogPosts } from '@/content/blogs'

const BASE = 'https://omanosaura.com'

export const revalidate = 86400

function entry(path: string, lastModified?: Date): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE}${path || '/'}`,
    lastModified: lastModified ?? new Date(),
    alternates: {
      languages: {
        en: `${BASE}${path || '/'}`,
        ar: `${BASE}/ar${path}`,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { id: true, lastUpdated: true },
  })

  return [
    entry(''),
    entry('/experiences'),
    entry('/blogs'),
    entry('/about'),
    entry('/contact'),
    ...products.map((p) =>
      entry(`/experiences/${encodeURIComponent(p.id)}`, p.lastUpdated),
    ),
    ...blogPosts.map((b) =>
      entry(`/blogs/${b.slug}`, new Date(b.createdAt)),
    ),
  ]
}
