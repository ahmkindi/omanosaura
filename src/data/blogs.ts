import { blogBySlug, blogPosts, type BlogPost } from '@/content/blogs'

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
}

function toDTO(post: BlogPost): BlogDTO {
  return {
    id: post.slug,
    title: post.title,
    titleAr: post.titleAr,
    description: post.description,
    descriptionAr: post.descriptionAr,
    photo: post.photo,
    page: post.page,
    pageAr: post.pageAr,
    createdAt: post.createdAt,
  }
}

export function getBlogs(): BlogDTO[] {
  return blogPosts.map(toDTO)
}

export function getBlog(slug: string): BlogDTO | null {
  const post = blogBySlug.get(slug)
  return post ? toDTO(post) : null
}

export function getBlogIds(): string[] {
  return blogPosts.map((p) => p.slug)
}
