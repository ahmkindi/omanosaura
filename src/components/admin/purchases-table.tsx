'use client'

import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import type { AdminPurchaseDTO } from '@/data/purchases'
import { exportCSV } from '@/lib/csv'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TablePagination } from '@/components/admin/table-pagination'

const PAGE_SIZE = 20

export function PurchasesTable({
  purchases,
}: {
  purchases: AdminPurchaseDTO[]
}) {
  const [query, setQuery] = useState('')
  const [payment, setPayment] = useState<'all' | 'card' | 'cash'>('all')
  const [when, setWhen] = useState<'all' | 'upcoming' | 'past'>('all')
  const [page, setPage] = useState(1)

  const today = new Date().toISOString().slice(0, 10)

  const filtered = useMemo(
    () =>
      purchases.filter((p) => {
        if (payment !== 'all' && (p.paid ? 'card' : 'cash') !== payment)
          return false
        if (when === 'upcoming' && p.chosenDate < today) return false
        if (when === 'past' && p.chosenDate >= today) return false
        return `${p.userName} ${p.userEmail} ${p.userPhone} ${p.productTitle}`
          .toLowerCase()
          .includes(query.toLowerCase())
      }),
    [purchases, query, payment, when, today],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const setFilter = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setPage(1)
  }

  return (
    <div className="space-y-4" dir="ltr">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search customer or experience…"
          value={query}
          onChange={(e) => setFilter(setQuery)(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={payment}
          onValueChange={(v) => setFilter(setPayment)(v as typeof payment)}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={when}
          onValueChange={(v) => setFilter(setWhen)(v as typeof when)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All dates</SelectItem>
            <SelectItem value="upcoming">Upcoming trips</SelectItem>
            <SelectItem value="past">Past trips</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              'purchases.csv',
              filtered.map((p) => ({
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
      <TablePagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        onPage={setPage}
      />
    </div>
  )
}
