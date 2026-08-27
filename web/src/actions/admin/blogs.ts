'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { cleanRichHtml } from '@/lib/sanitize'

const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(200),
  titleAr: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  descriptionAr: z.string().min(1).max(1000),
  photo: z.url(),
  page: z.string().min(1),
  pageAr: z.string().min(1),
})

export type BlogFormInput = z.infer<typeof blogSchema>

function revalidateBlogs(id: string) {
  for (const prefix of ['', '/ar']) {
    revalidatePath(`${prefix}/blogs`)
    revalidatePath(`${prefix}/blogs/${id}`)
  }
}

export async function upsertBlog(
  input: BlogFormInput,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  let user
  try {
    user = await requireRole('admin')
  } catch {
    return { ok: false, error: 'forbidden' }
  }

  const parsed = blogSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message }
  }
  const data = parsed.data
  const id = data.id || data.title.toLowerCase().trim().replaceAll(' ', '-')

  const values = {
    title: data.title,
    titleAr: data.titleAr,
    description: data.description,
    descriptionAr: data.descriptionAr,
    photo: data.photo,
    page: cleanRichHtml(data.page),
    pageAr: cleanRichHtml(data.pageAr),
  }

  await prisma.blog.upsert({
    where: { id },
    update: values,
    create: { id, ...values, userId: user.id, createdAt: new Date() },
  })
  revalidateBlogs(id)
  return { ok: true, id }
}

export async function deleteBlog(id: string): Promise<{ ok: boolean }> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false }
  }
  await prisma.blog.delete({ where: { id } }).catch(() => {})
  revalidateBlogs(id)
  return { ok: true }
}
