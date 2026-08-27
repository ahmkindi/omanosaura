import 'server-only'
import { prisma } from '@/lib/db'
import { toDateString } from './serialize'

export type BlogDTO = {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  photo: string
  page: string
  pageAr: string
  createdAt: string
  authorName: string
}

function toBlogDTO(blog: {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  photo: string
  page: string
  pageAr: string
  createdAt: Date
  user: { name: string }
}): BlogDTO {
  return {
    id: blog.id,
    title: blog.title,
    titleAr: blog.titleAr,
    description: blog.description,
    descriptionAr: blog.descriptionAr,
    photo: blog.photo,
    page: blog.page,
    pageAr: blog.pageAr,
    createdAt: toDateString(blog.createdAt),
    authorName: blog.user.name,
  }
}

export async function getBlogs(): Promise<BlogDTO[]> {
  const blogs = await prisma.blog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return blogs.map(toBlogDTO)
}

export async function getBlog(id: string): Promise<BlogDTO | null> {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  })
  return blog ? toBlogDTO(blog) : null
}

export async function getBlogIds(): Promise<string[]> {
  const rows = await prisma.blog.findMany({ select: { id: true } })
  return rows.map((r) => r.id)
}
