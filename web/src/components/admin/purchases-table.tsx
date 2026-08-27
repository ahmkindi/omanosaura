'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import type { AdminPurchaseDTO } from '@/data/purchases'
import { exportCSV } from '@/lib/csv'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function PurchasesTable({
  purchases,
}: {
  purchases: AdminPurchaseDTO[]
}) {
  const [query, setQuery] = useState('')

  const visible = purchases.filter((p) =>
    `${p.userName} ${p.userEmail} ${p.productTitle}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  return (
    <div className="space-y-4" dir="ltr">
      <div className="flex gap-2">
        <Input
          placeholder="Search purchases…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              'purchases.csv',
              visible.map((p) => ({
                experience: p.productTitle,
                name: p.userName,
                email: p.userEmail,
                phone: p.userPhone,
                tripDate: p.chosenDate,
                purchaseDate: p.createdAt,
                participants: p.numOfParticipants,
                totalOMR: (p.costBaisa / 1000).toFixed(3),
                paid: p.paid,
                extra: p.extraPriceChosen,
              })),
            )
          }
        >
          <Download className="size-4" /> Export
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Experience</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Trip Date</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Total (OMR)</TableHead>
            <TableHead>Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.productTitle}</TableCell>
              <TableCell>
                <div>{p.userName}</div>
                <div className="text-muted-foreground text-xs">
                  {p.userEmail} · {p.userPhone}
                </div>
              </TableCell>
              <TableCell>{p.chosenDate}</TableCell>
              <TableCell>{p.numOfParticipants}</TableCell>
              <TableCell>{(p.costBaisa / 1000).toFixed(3)}</TableCell>
              <TableCell>
                <Badge variant={p.paid ? 'default' : 'secondary'}>
                  {p.paid ? 'card' : 'cash'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
