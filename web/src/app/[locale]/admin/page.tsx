import { prisma } from '@/lib/db'
import { Link } from '@/i18n/navigation'
import { blogPosts } from '@/content/blogs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminHome() {
  const [products, users, purchases] = await Promise.all([
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.user.count(),
    prisma.purchase.count({ where: { complete: true } }),
  ])

  const stats = [
    { label: 'Experiences', value: products, href: '/admin/experiences' },
    { label: 'Blogs (static)', value: blogPosts.length, href: '/blogs' },
    { label: 'Users', value: users, href: '/admin/users' },
    { label: 'Purchases', value: purchases, href: '/admin/purchases' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" dir="ltr">
      {stats.map((s) => (
        <Link key={s.label} href={s.href as never}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{s.value}</CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
