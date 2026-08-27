import { prisma } from '@/lib/db'
import { Link } from '@/i18n/navigation'
import { toDateString } from '@/data/serialize'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  })

  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button asChild>
          <Link href={'/admin/blogs/new' as never}>New</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <Link
                  href={`/admin/blogs/${b.id}` as never}
                  className="font-medium hover:underline"
                >
                  {b.title}
                </Link>
              </TableCell>
              <TableCell>{b.user.name}</TableCell>
              <TableCell>{toDateString(b.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
