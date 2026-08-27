import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function AdminExperiencesPage() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    orderBy: { lastUpdated: 'desc' },
    select: {
      id: true,
      title: true,
      kind: true,
      photo: true,
      basePriceBaisa: true,
      pricePer: true,
    },
  })

  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experiences</h1>
        <Button asChild>
          <Link href={'/admin/experiences/new' as never}>New</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead>Base Price (OMR)</TableHead>
            <TableHead>Per</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="relative size-10 overflow-hidden rounded">
                  <Image
                    src={p.photo}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/experiences/${p.id}` as never}
                  className="font-medium hover:underline"
                >
                  {p.title}
                </Link>
              </TableCell>
              <TableCell>{p.kind}</TableCell>
              <TableCell>{(Number(p.basePriceBaisa) / 1000).toFixed(3)}</TableCell>
              <TableCell>{p.pricePer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
