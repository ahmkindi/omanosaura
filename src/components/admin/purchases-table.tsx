'use client'

import { useMemo, useState, useTransition } from 'react'
import { Download, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'
import type { AdminPurchaseDTO } from '@/data/purchases'
import { exportCSV } from '@/lib/csv'
import {
  adminCancelPurchase,
  adminReschedulePurchase,
  adminResendConfirmation,
  adminMarkRefunded,
} from '@/actions/admin/purchases'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

type Status = AdminPurchaseDTO['status']

const STATUS_VARIANT: Record<
  Status,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'outline',
  refund_pending: 'destructive',
  refunded: 'outline',
  expired: 'outline',
}

export function PurchasesTable({
  purchases,
}: {
  purchases: AdminPurchaseDTO[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [payment, setPayment] = useState<'all' | 'card' | 'cash'>('all')
  const [when, setWhen] = useState<'all' | 'upcoming' | 'past'>('all')
  const [status, setStatus] = useState<'all' | Status>('confirmed')
  const [page, setPage] = useState(1)
  const [busy, startTransition] = useTransition()
  const [cancelTarget, setCancelTarget] = useState<AdminPurchaseDTO | null>(null)
  const [rescheduleTarget, setRescheduleTarget] =
    useState<AdminPurchaseDTO | null>(null)
  const [newDate, setNewDate] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  const filtered = useMemo(
    () =>
      purchases.filter((p) => {
        if (status !== 'all' && p.status !== status) return false
        if (payment !== 'all' && (p.paid ? 'card' : 'cash') !== payment)
          return false
        if (when === 'upcoming' && p.chosenDate < today) return false
        if (when === 'past' && p.chosenDate >= today) return false
        return `${p.userName} ${p.userEmail} ${p.userPhone} ${p.productTitle} ${p.id}`
          .toLowerCase()
          .includes(query.toLowerCase())
      }),
    [purchases, query, payment, when, status, today],
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

  const run = (fn: () => Promise<{ ok: boolean }>, success: string) =>
    startTransition(async () => {
      const result = await fn()
      if (result.ok) {
        toast.success(success)
        setCancelTarget(null)
        setRescheduleTarget(null)
        router.refresh()
      } else {
        toast.error('Action failed — check the row state and try again')
      }
    })

  return (
    <div className="space-y-4" dir="ltr">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search customer, experience or reference…"
          value={query}
          onChange={(e) => setFilter(setQuery)(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(v) => setFilter(setStatus)(v as typeof status)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Payment pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refund_pending">Refund pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
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
                reference: p.id,
                status: p.status,
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
            <TableHead>Status</TableHead>
            <TableHead />
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
                <div className="text-muted-foreground font-mono text-[10px]">
                  {p.id}
                </div>
              </TableCell>
              <TableCell>
                {p.chosenDate}
                {p.rescheduledFrom && (
                  <div className="text-muted-foreground text-xs">
                    was {p.rescheduledFrom}
                  </div>
                )}
              </TableCell>
              <TableCell>{p.numOfParticipants}</TableCell>
              <TableCell>{(p.costBaisa / 1000).toFixed(3)}</TableCell>
              <TableCell>
                <Badge variant={p.paid ? 'default' : 'secondary'}>
                  {p.paid ? 'card' : 'cash'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[p.status]}>
                  {p.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={busy}>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {(p.status === 'confirmed' || p.status === 'pending') && (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setCancelTarget(p)}
                      >
                        Cancel{p.paid && p.status === 'confirmed' ? ' + refund' : ''}
                      </DropdownMenuItem>
                    )}
                    {p.status === 'confirmed' && (
                      <DropdownMenuItem
                        onClick={() => {
                          setNewDate('')
                          setRescheduleTarget(p)
                        }}
                      >
                        Reschedule
                      </DropdownMenuItem>
                    )}
                    {p.status === 'confirmed' && (
                      <DropdownMenuItem
                        onClick={() =>
                          run(
                            () => adminResendConfirmation({ purchaseId: p.id }),
                            'Confirmation email resent',
                          )
                        }
                      >
                        Resend confirmation
                      </DropdownMenuItem>
                    )}
                    {p.status === 'refund_pending' && (
                      <DropdownMenuItem
                        onClick={() =>
                          run(
                            () => adminMarkRefunded({ purchaseId: p.id }),
                            'Marked as refunded',
                          )
                        }
                      >
                        Mark refunded
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(p.id)
                        toast.success('Reference copied')
                      }}
                    >
                      Copy reference
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      <Dialog
        open={cancelTarget !== null}
        onOpenChange={(o) => !o && setCancelTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel booking?</DialogTitle>
          </DialogHeader>
          {cancelTarget && (
            <p className="text-muted-foreground text-sm">
              {cancelTarget.productTitle} on {cancelTarget.chosenDate} for{' '}
              {cancelTarget.userName}.{' '}
              {cancelTarget.paid && cancelTarget.status === 'confirmed'
                ? `A full refund of ${(cancelTarget.costBaisa / 1000).toFixed(3)} OMR will be issued via Thawani. If the automatic refund fails you'll get an action-required email.`
                : 'No payment was taken — this only cancels the booking.'}{' '}
              The customer will be emailed.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              disabled={busy}
            >
              Keep booking
            </Button>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() =>
                cancelTarget &&
                run(
                  () => adminCancelPurchase({ purchaseId: cancelTarget.id }),
                  'Booking cancelled',
                )
              }
            >
              Cancel booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={rescheduleTarget !== null}
        onOpenChange={(o) => !o && setRescheduleTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule booking</DialogTitle>
          </DialogHeader>
          {rescheduleTarget && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                {rescheduleTarget.productTitle} — currently{' '}
                {rescheduleTarget.chosenDate}. The customer will be emailed.
              </p>
              <Label htmlFor="admin-new-date">New date</Label>
              <Input
                id="admin-new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRescheduleTarget(null)}
              disabled={busy}
            >
              Back
            </Button>
            <Button
              disabled={busy || !newDate}
              onClick={() =>
                rescheduleTarget &&
                run(
                  () =>
                    adminReschedulePurchase({
                      purchaseId: rescheduleTarget.id,
                      newDate,
                    }),
                  'Booking rescheduled',
                )
              }
            >
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
