import { BlogForm } from '@/components/admin/blog-form'

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" dir="ltr">
        New Blog
      </h1>
      <BlogForm />
    </div>
  )
}
