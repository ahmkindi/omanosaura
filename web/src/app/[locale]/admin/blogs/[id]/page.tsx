import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { BlogForm } from '@/components/admin/blog-form'

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const blog = await prisma.blog.findUnique({ where: { id } })
  if (!blog) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" dir="ltr">
        Edit: {blog.title}
      </h1>
      <BlogForm
        initial={{
          id: blog.id,
          title: blog.title,
          titleAr: blog.titleAr,
          description: blog.description,
          descriptionAr: blog.descriptionAr,
          photo: blog.photo,
          page: blog.page,
          pageAr: blog.pageAr,
        }}
      />
    </div>
  )
}
